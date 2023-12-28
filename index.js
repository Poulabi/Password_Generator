const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDiplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-pass-Display]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numericCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");

const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbolString='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// console.log('Hello');
let password="";
let passLength=10;
let checkCount=0; 
handleSlider();
setIndicator("#ccc")

// set pass length
function handleSlider(){
    inputSlider.Value=passLength;
    // console.log(inputSlider.Value);
    lengthDiplay.innerText=passLength;
    // or kuch bhi karne chiay ?
}
function setIndicator(color){
    indicator.style.background=color;
    // shadow -HW
}

function getRndInteger(min,max){
    return Math.floor(Math.random() *(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return  String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return  String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const x=getRndInteger(0,symbolString.length);
    // return symbolString[x];
    return symbolString.charAt(x);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numericCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passLength >= 8) {
        setIndicator("#0f0");
    }
    else if (
      (hasLower || hasUpper) && (hasNum || hasSym) && passLength >= 6
    ){
        setIndicator("#ff0");
      }
    else{
        setIndicator("#f00");
    }
}
// it means : at a time kaj ta hobe. mane onno j kono ek ba eker besi function er sathe execute hote pare
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied"
        setTimeout(()=>{
            copyMsg.innerText="";    
        },2000);   
    }
    catch(e){
        copyMsg.innerText="failed to copy";
    }
    // copyMsg.classList.add("active");
    // // to  make it visible only for 2s
    // setTimeout( () => {
    //     copyMsg.classList.remove("active");
    // },2000);
}

// from this onwards through Copy,need to understand
// ***Please understand
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount=checkCount+1;
    });
    //special condition
    if(passLength < checkCount ) {
        passLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange());
})
// addEventListener takes two argument i.e first one is action, & 2nd one is if the action will implement then what we will have to do
inputSlider.addEventListener('input', (e) => {
    passLength = e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click', () => {
    // only for nonzero length
    if(passwordDisplay.value)
        copyContent();
})
// MAIN FUNCTION-
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    // generateBtn.style.background='blue';
    if(checkCount = 0) 
        return;
    // console.log('Base condition false');
    if(passLength < checkCount ) {
        passLength = checkCount;
        handleSlider();
    }
    // let's start the jouney to find new password
    // console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();

    let funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numericCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    // console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        // console.log("randIndex " + randIndex);
        password += funcArr[randIndex]();
    }
    // console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    // console.log("showing in output done");
    //calculate strength
    calcStrength();
});