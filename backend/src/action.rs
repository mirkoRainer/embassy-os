use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;
use std::str::FromStr;

use clap::ArgMatches;
use color_eyre::eyre::eyre;
use indexmap::IndexSet;
use rpc_toolkit::command;
use serde::{Deserialize, Serialize};
use tracing::instrument;

use crate::config::{Config, ConfigSpec};
use crate::context::RpcContext;
use crate::id::{Id, ImageId, InvalidId};
use crate::procedure::{PackageProcedure, ProcedureName};
use crate::s9pk::manifest::PackageId;
use crate::status::health_check::HealthCheckId;
use crate::util::serde::{display_serializable, parse_stdin_deserializable, IoFormat};
use crate::util::Version;
use crate::volume::Volumes;
use crate::{Error, ResultExt};

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize)]
pub struct ActionId<S: AsRef<str> = String>(Id<S>);
impl FromStr for ActionId {
    type Err = InvalidId;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Ok(ActionId(Id::try_from(s.to_owned())?))
    }
}
impl From<ActionId> for String {
    fn from(value: ActionId) -> Self {
        value.0.into()
    }
}
impl<S: AsRef<str>> AsRef<ActionId<S>> for ActionId<S> {
    fn as_ref(&self) -> &ActionId<S> {
        self
    }
}
impl<S: AsRef<str>> std::fmt::Display for ActionId<S> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", &self.0)
    }
}
impl<S: AsRef<str>> AsRef<str> for ActionId<S> {
    fn as_ref(&self) -> &str {
        self.0.as_ref()
    }
}
impl<S: AsRef<str>> AsRef<Path> for ActionId<S> {
    fn as_ref(&self) -> &Path {
        self.0.as_ref().as_ref()
    }
}
impl<'de, S> Deserialize<'de> for ActionId<S>
where
    S: AsRef<str>,
    Id<S>: Deserialize<'de>,
{
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::de::Deserializer<'de>,
    {
        Ok(ActionId(Deserialize::deserialize(deserializer)?))
    }
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct Actions(pub BTreeMap<ActionId, Action>);

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "version")]
pub enum ActionResult {
    #[serde(rename = "0")]
    V0(ActionResultV0),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ActionResultV0 {
    pub message: String,
    pub value: Option<String>,
    pub copyable: bool,
    pub qr: bool,
}

#[derive(Clone, Copy, Debug, Hash, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum DockerStatus {
    Running,
    Stopped,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub struct Action {
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub warning: Option<String>,
    pub implementation: PackageProcedure,
    pub allowed_statuses: IndexSet<DockerStatus>,
    #[serde(default)]
    pub input_spec: ConfigSpec,
}
impl Action {
    #[instrument]
    pub fn validate(&self, volumes: &Volumes, image_ids: &BTreeSet<ImageId>) -> Result<(), Error> {
        self.implementation
            .validate(volumes, image_ids, true)
            .with_ctx(|_| {
                (
                    crate::ErrorKind::ValidateS9pk,
                    format!("Action {}", self.name),
                )
            })
    }

    #[instrument(skip(ctx))]
    pub async fn execute(
        &self,
        ctx: &RpcContext,
        pkg_id: &PackageId,
        pkg_version: &Version,
        action_id: &ActionId,
        volumes: &Volumes,
        input: Option<Config>,
    ) -> Result<ActionResult, Error> {
        if let Some(ref input) = input {
            self.input_spec
                .matches(&input)
                .with_kind(crate::ErrorKind::ConfigSpecViolation)?;
        }
        self.implementation
            .execute(
                ctx,
                pkg_id,
                pkg_version,
                ProcedureName::Action(action_id.clone()),
                volumes,
                input,
                true,
                None,
            )
            .await?
            .map_err(|e| Error::new(eyre!("{}", e.1), crate::ErrorKind::Action))
    }
}

fn display_action_result(action_result: ActionResult, matches: &ArgMatches<'_>) {
    if matches.is_present("format") {
        return display_serializable(action_result, matches);
    }
    match action_result {
        ActionResult::V0(ar) => {
            println!(
                "{}: {}",
                ar.message,
                serde_json::to_string(&ar.value).unwrap()
            );
        }
    }
}

#[command(about = "Executes an action", display(display_action_result))]
#[instrument(skip(ctx))]
pub async fn action(
    #[context] ctx: RpcContext,
    #[arg(rename = "id")] pkg_id: PackageId,
    #[arg(rename = "action-id")] action_id: ActionId,
    #[arg(stdin, parse(parse_stdin_deserializable))] input: Option<Config>,
    #[allow(unused_variables)]
    #[arg(long = "format")]
    format: Option<IoFormat>,
) -> Result<ActionResult, Error> {
    let mut db = ctx.db.handle();
    let manifest = crate::db::DatabaseModel::new()
        .package_data()
        .idx_model(&pkg_id)
        .and_then(|p| p.installed())
        .expect(&mut db)
        .await
        .with_kind(crate::ErrorKind::NotFound)?
        .manifest()
        .get(&mut db, true)
        .await?
        .to_owned();
    if let Some(action) = manifest.actions.0.get(&action_id) {
        action
            .execute(
                &ctx,
                &manifest.id,
                &manifest.version,
                &action_id,
                &manifest.volumes,
                input,
            )
            .await
    } else {
        Err(Error::new(
            eyre!("Action not found in manifest"),
            crate::ErrorKind::NotFound,
        ))
    }
}
