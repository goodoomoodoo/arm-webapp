import Simulation from '../sim/simulation';
import Action from './action/action';
import Editor from './editor/editor';
import Monitor from './monitor/monitor';

/* Mount components */
let sim: Simulation = new Simulation();
let editor: Editor = new Editor();
new Action(sim, editor);
new Monitor(sim);