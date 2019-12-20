const execSync = require('child_process').execSync;

const getIP = () => {
    const output = execSync('netsh interface ip show address name="wi-fi"', { encoding: 'utf-8' });
    let address= "";
    for (let line of output.split('\n')) {
        const s = line;
        if(s.indexOf('IP Address') >= 0){
            const ip = s.substr(s.indexOf(':')).split(' ');
            address = ip[ip.length - 1];
            break;
        } 
    }
    return address;
};

module.exports = {
    getIP
}