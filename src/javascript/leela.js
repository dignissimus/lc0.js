runUci = (args) => PThread.runningWorkers.forEach(worker => worker.postMessage({cmd: "uci", args}))
downloadWeights = () => PThread.runningWorkers.forEach(worker => worker.postMessage({ cmd: "download" }))
setOption = (name, value) => runUci(`setoption name ${name} value ${value}`);
go = () => runUci("go");

const begin = async () => {
    const weightUrl = "weights.pb.gz.bin";
    const weightPath = "/home/web_user/weights.pb.gz";
    let weightData;
    if (!weightData) {
        console.log("Downloading weights");
        const response = await fetch(weightUrl);
        const data = await response.blob();
        const arrayBuffer = await data.arrayBuffer();
        weightData = new Uint8Array(arrayBuffer);
    }

    FS.writeFile(weightPath, weightData);
    downloadWeights();
    setOption("WeightsFile", "/home/web_user/weights.pb.gz");
    setOption("backend", "eigen");
}

const infoKeys = ['cp', 'depth', 'nps', 'seldepth'];
const processUci = (response) => {
    parts = response.split(" ");
    if (!parts.length) return;
    command = parts[0];
    if (command === 'info') {
        const data = {};
        infoKeys.forEach(key => {
            if (parts.includes(key)) {
                data[key] = parts[parts.indexOf(key) + 1];
            }
        });
        if (parts.includes('pv')) {
            data['pv'] = parts.slice(parts.indexOf('pv') + 1);
        }
        console.log("data", data);
    }
    if (command === 'bestmove') {
        const move = parts[1];
        console.log("move", move);
    }
};

const loop = () => Module["output"].get().then(processUci).then(loop);
loop();

