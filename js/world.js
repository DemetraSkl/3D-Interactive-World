function World() {

    this.floor = function() {
        var floorTexture = new THREE.ImageUtils.loadTexture('images/grasslight-big.jpg');
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(10, 10);
        var floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
        var worldFloor = new THREE.Mesh(floorGeometry, floorMaterial);
        return worldFloor;
    };

};