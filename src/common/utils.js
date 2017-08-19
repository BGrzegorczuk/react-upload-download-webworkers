/* eslint no-mixed-operators: off */

export function guid() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// export function fakeGuid() {
//     return 'fakeGuid';
// }

export function fileToArrayBuffer(file, onSuccess) {
    const r = new FileReader();
    r.onload = onSuccess;
    r.readAsArrayBuffer(file);
}