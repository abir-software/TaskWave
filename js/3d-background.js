  /*hide / disconnected from the 3D background script to avoid conflicts with the current task
// 3D Background with Three.js
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('3d-background');
    
    // Only initialize if container exists
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Create floating shapes
    const shapes = [];
    const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.ConeGeometry(1, 2, 32)
    ];
    
    // Create 12 floating shapes
    for (let i = 0; i < 12; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: Math.random() * 0xffffff,
            transparent: true,
            opacity: 0.6,
            shininess: 100
        });
        
        const shape = new THREE.Mesh(geometry, material);
        
        // Random position
        shape.position.x = Math.random() * 30 - 15;
        shape.position.y = Math.random() * 20 - 10;
        shape.position.z = Math.random() * 30 - 15;
        
        // Random rotation
        shape.rotation.x = Math.random() * Math.PI;
        shape.rotation.y = Math.random() * Math.PI;
        
        // Random size
        const scale = Math.random() * 0.8 + 0.5;
        shape.scale.set(scale, scale, scale);
        
        // Store original positions for animation
        shape.userData = {
            originalX: shape.position.x,
            originalY: shape.position.y,
            originalZ: shape.position.z,
            speedX: Math.random() * 0.01 - 0.005,
            speedY: Math.random() * 0.01 - 0.005,
            speedZ: Math.random() * 0.01 - 0.005,
            rotSpeedX: Math.random() * 0.01,
            rotSpeedY: Math.random() * 0.01,
            rotSpeedZ: Math.random() * 0.01
        };
        
        scene.add(shape);
        shapes.push(shape);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Camera position
    camera.position.z = 25;
    
    // Handle window resize
    function handleResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Animate shapes
        const time = Date.now() * 0.001;
        
        shapes.forEach(shape => {
            // Float with slight variation
            shape.position.y = shape.userData.originalY + Math.sin(time * 0.5) * 3;
            shape.position.x = shape.userData.originalX + Math.sin(time * 0.3) * 4;
            shape.position.z = shape.userData.originalZ + Math.cos(time * 0.4) * 4;
            
            // Rotate
            shape.rotation.x += shape.userData.rotSpeedX;
            shape.rotation.y += shape.userData.rotSpeedY;
            shape.rotation.z += shape.userData.rotSpeedZ;
        });
        
        renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Handle theme changes
    document.addEventListener('themeChanged', function() {
        const isDark = document.documentElement.classList.contains('dark');
        ambientLight.intensity = isDark ? 0.2 : 0.4;
        directionalLight.intensity = isDark ? 0.3 : 0.5;
    });
});