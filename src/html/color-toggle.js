AFRAME.registerComponent('color-toggle', {
  init: function(){
    let el = this.el;
    this.toggleColor = function(){
      alert('clicked');
    }
    this.el.addEventListener('click', this.toggleColor);
  },
  remove: function(){
    this.el.removeEventListener('click', this.toggleColor);
  }
})
