      /**
       * Example for a basic THREE.js scene setup.
       * 
       * @author  Ikaros Kappler
       * @date    2015-11-09
       * @version 1.0.0
       **/

(function() {

      function mkVoxelTorus() {
            var minorRadius = 50;
            var majorRadius = 150;
            var raster      =  16; 

            // Found at:
            //    https://stackoverflow.com/questions/13460711/given-origin-and-radii-how-to-find-out-if-px-y-z-is-inside-torus
            //
            //    From my calculation you must test the sign of the expression
            //    (x^2+y^2+z^2+a^2-b^2)^2-4a^2(x^2+y^2)
            //    where the point is {x,y,z} and the minor radius of the torus is b, and the major radius a.

            // Pick a material, something like MeshBasicMaterial, PhongMaterial, 
            var material = new THREE.MeshPhongMaterial({color: 0x00ff00}); 

            // Create a geometry conaining the logical 3D information (here: a cube)
            var geometry = new THREE.Geometry(); // empty
            
            // Create the cube from the geometry and the material ...
            var torus = new THREE.Mesh(geometry, material); 

            var bounds = new THREE.Box3( 
                  new THREE.Vector3( -majorRadius-minorRadius, -majorRadius-minorRadius, -majorRadius-minorRadius ),
                  new THREE.Vector3(  majorRadius+minorRadius,  majorRadius+minorRadius,  majorRadius+minorRadius )
                  );
            for( var x = bounds.min.x + raster/2; x < bounds.max.x+raster/2; x+= raster ) {
                  var xPow = x*x;
                  for( var y = bounds.min.y + raster/2; y < bounds.max.y+raster/2; y+= raster ) {
                        var yPow = y*y;
                        for( var z = bounds.min.z + raster/2; z < bounds.max.z+raster/2; z+= raster ) {
                              if( Math.pow(x*x+y*y+z*z+Math.pow(majorRadius,2)-Math.pow(minorRadius,2),2)-4*Math.pow(majorRadius,2)*(x*x+y*y) > 0 )
                                    continue;
                              // Add a voxel at {x,y,z}
                              // Create a geometry conaining the logical 3D information (here: a cube)
                              var voxelGeometry = new THREE.CubeGeometry(raster,raster,raster); 

                              // Pick a material, something like MeshBasicMaterial, PhongMaterial, 
                              var material = new THREE.MeshPhongMaterial({color: 0x00ff00}); 
                              
                              // Create the cube from the geometry and the material ...
                              var voxel = new THREE.Mesh(voxelGeometry, material); 
                              voxel.position.set( x, y, z );

                              torus.children.push( voxel );
                        }
                  }     
            }
            
            return torus;
      }

      function init() {
            window.removeEventListener('load',init);

            // Create new scene
            this.scene = new THREE.Scene(); 

            // Create a camera to look through
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); 

            // Initialize a new THREE renderer (you are also allowed 
            // to pass an existing canvas for rendering).
            this.renderer = new THREE.WebGLRenderer( { antialias : true } ); 
            this.renderer.setSize( window.innerWidth, 
            window.innerHeight
            ); 

            // ... and append it to the DOM
            document.body.appendChild(renderer.domElement); 


            // Create a geometry conaining the logical 3D information (here: a cube)
            var geometry = new THREE.CubeGeometry(12,12,12); 

            // Pick a material, something like MeshBasicMaterial, PhongMaterial, 
            var material = new THREE.MeshPhongMaterial({color: 0x00ff00}); 
            
            // Create the cube from the geometry and the material ...
            var cube = new THREE.Mesh(geometry, material); 
            //cube.position.set( 12, 12, 12 );

            // ... and add it to your scene.
            this.scene.add(cube); 

            var torus = mkVoxelTorus();
            torus.position.set( -12, -12, -12 );
            torus.rotation.x = Math.PI/2;
            torus.rotation.y = Math.PI/2;
            torus.rotation.z = Math.PI/2;
            this.scene.add( torus );


            // Add some light
            this.pointLight = new THREE.PointLight(0xFFFFFF);
            //this.pointLight = new THREE.AmbientLight(0xFFFFFF);

            // set its position
            this.pointLight.position.x = 10;
            this.pointLight.position.y = 50;
            this.pointLight.position.z = 130;

            // add to the scene
            this.scene.add( this.pointLight );


            // Add grid helper
            var gridHelper = new THREE.GridHelper( 90, 9 );
            gridHelper.colorGrid = 0xE8E8E8;
            this.scene.add( gridHelper );


            // Add an axis helper
            var ah                  = new THREE.AxesHelper(50);
            ah.position.y -= 0.1;  // The axis helper should not intefere with the grid helper
            this.scene.add( ah );


            // Set the camera position
            this.camera.position.set( 75, 75, 75 );
            // And look at the cube again
            this.camera.lookAt( cube.position );


            // Finally we want to be able to rotate the whole scene with the mouse: 
            // add an orbit control helper.
            var _self = this;
            this.orbitControls = new THREE.OrbitControls( this.camera, this.renderer.domElement ); 
            // Always move the point light with the camera. Looks much better ;)
            this.orbitControls.addEventListener( 'change', 
                  function() { _self.pointLight.position.copy(_self.camera.position); } 
            );
            this.orbitControls.enableDamping = true;
            this.orbitControls.dampingFactor = 1.0;
            this.orbitControls.enableZoom    = true;
            this.orbitControls.target.copy( cube.position );  



            // This is the basic render function. It will be called perpetual, again and again,
            // depending on your machines possible frame rate.
            this._render = function () { 
                  // Pass the render function itself
                  requestAnimationFrame(this._render); 
                  
                  // Let's animate the cube: a rotation.
                  cube.rotation.x += 0.05; 
                  cube.rotation.y += 0.04; 

                  this.renderer.render(this.scene, this.camera); 
            }; 
            // Call the rendering function. This will cause and infinite recursion (we want 
            // that here, because the animation shall run forever).
            this._render();

      } // END function init

      window.addEventListener('load', init );
})();
    