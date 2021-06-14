export enum Switch {
    register,
    memory
};

export default class NavBar {
  /**
   * NavBar container
   */

  seleted: number;

  constructor() {
    this.seleted = Switch.register;

    this.setUp = this.setUp.bind(this);
    
    this.setUp();
  }

  setUp() {
    let registerBtn = document.getElementById('select-register-btn');
    let memoryBtn = document.getElementById('select-memory-btn');

    registerBtn?.addEventListener('click', () => {
      if (this.seleted != Switch.register) {
        registerBtn?.classList.remove('unselected');
        registerBtn?.classList.add('selected');
        memoryBtn?.classList.remove('selected');
        memoryBtn?.classList.add('unselected');
        this.seleted = Switch.register;
      }
    });

    memoryBtn?.addEventListener('click', () => {
      if (this.seleted != Switch.memory) {
        memoryBtn?.classList.remove('unselected');
        memoryBtn?.classList.add('selected');
        registerBtn?.classList.remove('selected');
        registerBtn?.classList.add('unselected');
        this.seleted = Switch.memory;
      }
    });
  }
}