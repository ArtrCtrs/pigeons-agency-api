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
    console.log(expeditionsem)
} catch (e) {
    console.log(e);
}
export default globalhelper; 