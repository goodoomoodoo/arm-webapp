/*******************************************************************************
 * Buttons 
 ******************************************************************************/
const stepButton = document.getElementById('step-btn');
const buildButton = document.getElementById('build-btn');
const runButton = document.getElementById('run-btn');

/*******************************************************************************
 * Editor Logic
 ******************************************************************************/
export default class Editor {
  /**
   * Editor container
   */
  lineCount: number;

  constructor() {
    this.lineCount = 1;
    
    this.setUp = this.setUp.bind(this);
    this.setUpCode = this.setUpCode.bind(this);

    this.setUp();
  }

  setUp() {
    this.setUpCode();
  }

  setUpCode() {
    let textArea = document.getElementById('code');

    if (textArea !== undefined && textArea !== null) {
      let codeTA: HTMLTextAreaElement = textArea as HTMLTextAreaElement;

      codeTA.addEventListener('input', event => {
        let code: string = (<HTMLTextAreaElement>event.target).value;
        let lnDiv = document.getElementById('line-nu-div');
        let lineCount: number = code.split('\n').length;

        /* Add span line number */
        let diff: number = lineCount - this.lineCount;

        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            let newSpan = document.createElement('span');
            newSpan.innerHTML = `${this.lineCount + i + 1}`;
            newSpan.setAttribute('id', `ln-${this.lineCount + i + 1}`);
            lnDiv?.appendChild(newSpan);
          }
        } else if (diff < 0) {
          for (let i = 0; i > diff; i--) {
            let oldSpan = document.getElementById(`ln-${this.lineCount + i}`);

            if (oldSpan !== null) lnDiv?.removeChild(oldSpan);
          }
        }

        this.lineCount = lineCount;
      });
    }
  }
}