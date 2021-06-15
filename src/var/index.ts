import Simulation from '../sim/simulation';
import Editor from './editor/editor';
import Monitor from './monitor/monitor';

/* Mount components */
let sim: Simulation = new Simulation();
new Editor(sim);
new Monitor(sim);