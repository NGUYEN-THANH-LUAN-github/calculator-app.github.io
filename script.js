const nums = document.querySelectorAll('[num]');
const screen = document.querySelector('.screen');
const equals = document.querySelector('[equals]');
const operators = document.querySelectorAll('[operator]');
const ac = document.querySelector('[clear]');
const toggleMinus = document.querySelector('[toggle-minus]');
const c = document.querySelector('[delete]');
const buttons = document.querySelectorAll('button');
const operation = {
    currentOperand: "",
    previousOperand: "",
    operator: undefined,
    appendNum(num) {
        if (this.currentOperand !== '') {
            const displayLength = getDisplayLength();
            if (displayLength >= 9) return;
        }
        if (num === "." && screen.innerText.includes(".")) return;
        this.currentOperand += num
    },
    chooseOperator(op) {
        if (this.operator && this.currentOperand === "") {
            this.operator = op;
            return;
        }
        if (this.previousOperand === "") {
            this.operator = op;
            this.previousOperand = this.currentOperand;
            this.currentOperand = "";
        }
        if (this.currentOperand !== "") {
            this.compute();
            this.operator = op;
            this.previousOperand = this.currentOperand;
            this.updateScreen();
            this.currentOperand = "";
        }
    },
    toggleMinusSign() {
        this.currentOperand = parseFloat(this.currentOperand) * -1;
        this.updateScreen();
    },
    compute() {
        let computation;
        let a = parseFloat(this.previousOperand);
        let b = parseFloat(this.currentOperand);
        if (this.currentOperand === "") {
            b = parseFloat(screen.innerText);
        }
        switch (this.operator) {
            case "+":
                computation = a + b;
                break;
            case "-":
                computation = a - b;
                break;
            case "÷":
                if (b === 0) {
                    screen.innerText = 'Error: Divided by Zero';
                    screen.style.cssText = "font-size: 3.3vh";
                    return;
                }
                computation = a / b;
                break;
            case "×":
                computation = a * b;
        };
        if (computation.toString().length > 9) {
            if (computation.toString().split('.')[0].length > 9) {
                screen.innerText = 'Error: Max Digits Exceeded';
                screen.style.cssText = "font-size: 3.3vh";
                return;
            }
            const decimalDigitsLength = 9 - computation.toString().split('.')[0].length;
            computation = computation.toFixed(decimalDigitsLength);
        }
        // if (isNaN(computation)) { this.currentOperand = ''; return; }
        this.currentOperand = computation;
        this.updateScreen();
        this.clearAll();
        this.currentOperand = computation;
    },
    updateScreen() {
        screen.innerText = this.currentOperand;
        const displayLength = getDisplayLength();
        if (displayLength <= 6) {
            screen.style.fontSize = "9vh";
        } else if (displayLength > 6 && displayLength <= 9) {
            screen.style.fontSize = "6.2vh";
        }
    },
    clearAll() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operator = undefined;
    },
    delete() {
        if (this.currentOperand === "" && this.operator) {
            removeChosenOperatorClass();
            return;
        }
        this.currentOperand = "";
        operators.forEach(operator => {
            if (operator.innerText === this.operator) {
                operator.classList.add('chosen-operator');
            }
        })
        this.updateScreen();
    }
}

nums.forEach(num => {
    num.addEventListener('click', () => {
        removeChosenOperatorClass();
        operation.appendNum(num.innerText);
        operation.updateScreen();
    })
})

operators.forEach(operator => {
    operator.addEventListener('click', () => {
        removeChosenOperatorClass();
        operator.classList.add('chosen-operator');
        operation.chooseOperator(operator.innerText);
    })
})

equals.addEventListener('click', () => {
    removeChosenOperatorClass();
    operation.compute();
})

ac.addEventListener('click', () => {
    operation.clearAll();
    operation.updateScreen();
    removeChosenOperatorClass();
})
c.addEventListener('click', () => {
    operation.delete();
})

toggleMinus.addEventListener('click', () => {
    operation.toggleMinusSign();
})

function removeChosenOperatorClass() {
    operators.forEach(operator => {
        operator.classList.remove('chosen-operator');
    })
}

function getDisplayLength() {
    let displayLength = screen.innerText.length;
    if (screen.innerText.includes('.')) {
        displayLength = screen.innerText.split('.').join('').length;
    }
    return displayLength;
}
window.addEventListener("keydown", (e) => {
    buttons.forEach(button => {
        if (button.value === e.key) {
            button.click();
        }
    })
});