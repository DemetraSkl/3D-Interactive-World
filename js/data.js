function User(name, idNum, x, y, z) {
    this.name = name;
    this.idNum = idNum;
    this.x = x;
    this.y = y;
    this.z = z;
    this.color = 0x00ff00;
    this.radius = 20;
    this.widthSegments = 32;
    this.heightSegments = 32;
    this.sphereAvatar;
    this.othersAvatar;
    this.xSpeed = 10;
    this.zSpeed = 10;

    this.getUserID = function() {
        return this.idNum;
    };

    this.createAvatar = function() {
        var sphereGeometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.sphereAvatar = new THREE.Mesh(sphereGeometry, sphereMaterial);
    };

    this.getAvatar = function() {
        return this.sphereAvatar;
    };

    this.createOthersAvatar = function() {
        var sphereGeometry = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
        var sphereMaterial = new THREE.MeshBasicMaterial({ color: this.color });
        this.othersAvatar = new THREE.Mesh(sphereGeometry, sphereMaterial);
    };

    this.getCoords = function() {
        return [x, y, z];
    };

    // Set new coords
    this.setCoords = function(x_new, y_new, z_new) {
        this.x = x_new;
        this.y = y_new;
        this.z = z_new;
    };

    this.setX = function(x_new) {
        this.x = x_new;
    };

    this.setY = function(y_new) {
        this.y = y_new;
    };

    this.setZ = function(z_new) {
        this.z = z_new;
    };

    this.setSpeed = function(dx, dz){
        this.xSpeed = dx;
        this.zSpeed = dz;
    };

    this.getSpeed = function(){
        return [this.xSpeed, this.zSpeed];
    };

}