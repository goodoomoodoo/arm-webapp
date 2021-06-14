import Simulation from '../../sim/simulation';

export default class Editor {
  /**
   * Editor container
   */
  lineCount: number;
  sim: Simulation;

  constructor() {
    this.lineCount = 1;
    this.sim = null as any;
    
    this.setup = this.setup.bind(this);
    this.setupCode = this.setupCode.bind(this);
    this.setupCmd = this.setupCmd.bind(this);

    this.setup();
  }

  setup() {
    this.setupCode();
    this.setupCmd();
  }

  setupCode() {
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

  setupCmd() {
    let stepButton = document.getElementById('step-btn');
    let buildButton = document.getElementById('build-btn');
    let runButton = document.getElementById('run-btn');

    buildButton?.addEventListener('click', () => {
      let codeTA = document.getElementById('code');
      let instr: string[] = codeTA?.nodeValue?.split('\n') || [];
      this.sim = new Simulation(instr);
      this.sim.assemble();
    });
  }
}