let expeditionsem: boolean = false;

let globalhelper: any = null;
try {
    globalhelper = {
        getExpSem: () => {
            if (expeditionsem) {
                console.log("sem taken");
            }
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