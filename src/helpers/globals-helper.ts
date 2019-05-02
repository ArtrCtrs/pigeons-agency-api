let expeditionsem: boolean = false;

let globalhelper: any = null;
try {
    globalhelper = {
        getSem: () => {
            return expeditionsem;
        },
        setTrue: () => {
            expeditionsem = true;
        },
        setFalse: () => {
            expeditionsem = false;
        }
    };
    console.log(expeditionsem)
} catch (e) {
    console.log(e);
}
export default globalhelper; 