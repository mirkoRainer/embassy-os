use std::sync::Arc;

use rpc_toolkit::command;

use crate::context::RpcContext;
use crate::disk::main::export_blocking;
use crate::util::display_none;
use crate::Error;

#[derive(Debug, Clone)]
pub struct Shutdown {
    zfs_pool: Arc<String>,
    restart: bool,
}
impl Shutdown {
    /// BLOCKING
    pub fn execute(&self) {
        use std::process::Command;

        if let Err(e) = export_blocking(&self.zfs_pool) {
            log::error!("Error Exporting ZFS Pool: {}", e);
        }
        if self.restart {
            Command::new("reboot").spawn().unwrap().wait().unwrap();
        } else {
            Command::new("shutdown")
                .arg("now")
                .spawn()
                .unwrap()
                .wait()
                .unwrap();
        }
    }
}

#[command(display(display_none))]
pub async fn shutdown(#[context] ctx: RpcContext) -> Result<(), Error> {
    ctx.shutdown.send(Some(Shutdown {
        zfs_pool: ctx.zfs_pool_name.clone(),
        restart: false,
    }));
    Ok(())
}

#[command(display(display_none))]
pub async fn restart(#[context] ctx: RpcContext) -> Result<(), Error> {
    ctx.shutdown.send(Some(Shutdown {
        zfs_pool: ctx.zfs_pool_name.clone(),
        restart: true,
    }));
    Ok(())
}
