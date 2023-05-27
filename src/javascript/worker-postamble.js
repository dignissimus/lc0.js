self.onmessage = (e) => {
    if (e.data.cmd === 'uci') {
        try {
            Module["queue"].push(e.data.args);
        }
        catch {}
    }
    else {
        handleMessage(e);
    }
}
