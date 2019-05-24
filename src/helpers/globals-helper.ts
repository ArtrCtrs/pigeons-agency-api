let expeditionsem: boolean = false;

let globalhelper: any = null;
try {
    globalhelper = {
        getExpSem: () => {
            return expeditionsem;
        },
        setExpTrue: () => {
            expeditionsem = true;
        },
        setExpFalse: () => {
            expeditionsem = false;
        }
    };
} catch (e) {
    console.log(e);
}
export default globalhelper; 