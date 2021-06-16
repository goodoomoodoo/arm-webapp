import Simulation from "../../sim/simulation";
import Editor from "../editor/editor";

export default class Action {
    /**
     * Action container
     */

    sim: Simulation;
    editor: Editor;

    constructor(inSim: Simulation, inEditor: Editor) {
        this.sim = inSim;
        this.editor = inEditor;

        this.setup = this.setup.bind(this);

        this.setup();
    }

    setup() {
        let stepButton = document.getElementById('step-btn');
        let buildButton = document.getElementById('build-btn');
        let runButton = document.getElementById('run-btn');
    
        buildButton?.addEventListener('click', () => {
          this.sim.assemble(this.editor.code);
        });
    
        stepButton?.addEventListener('click', () => {
          this.sim.step();
        })
      }
}