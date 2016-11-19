function PathData(d){
    this._changed = false;
    this.text = d;
    this.data = this.fromString(d)
    return this;
}
PathData.prototype.fromString = (d)=>d.replace(/\B([A-z])/g,';$1').split(';')
    .map((p)=>(
    a=p.replace(/([a-zA-Z])/g, '$1:').replace(/(\d)(\-)/g,'$1,$2').split(':'),
        o={},
        o[a[0]]=a[1]
            .split(',').map(Number),
        o
));
PathData.prototype.toString = function(){
    return this.data.map((p)=>(
            m = Object.keys(p)[0],
            m + p[m]
        )).join('');
}
PathData.prototype.scale = function (x,y){
    y=y||x;
    if(this.changed = typeof x !== 'undefined' || (x === 1 && y === 1)){
        this.data = this.data.map((p)=>(
                m = Object.keys(p)[0],
                    p[m]=p[m].map((z)=>(z*x)),
            p
        ));
    }
    return this;
};
module.exports = PathData;
