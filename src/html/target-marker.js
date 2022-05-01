AFRAME.registerComponent('target-marker', {
  init: function(){
    let el = this.el;
    
    this.addMarker= function(e){
    let p = e.detail.intersection.point; //speichert Koordinaten des angeklickten Punkt
    let scene = document.querySelector('a-scene');
      
    let newMark = document.createElement('a-entity');
    newMark.setAttribute('geometry', {
      primitive: 'sphere'
    });
      newMark.setAttribute('material', 'color: red');
      newMark.setAttribute('scale', '.2 .2 .2');
      newMark.setAttribute('position', p);
      scene.appendChild(newMark);
    }
    
    this.el.addEventListener('click', this.addMarker);
  },
  remove: function(){
    this.el.removeEventlistener ('click', this.addMarker);
  }
});
