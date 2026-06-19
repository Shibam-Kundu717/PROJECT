class DomainExpansionTracker {
    constructor() {
        this.domains = {
            'malevolent shrine': { color: '#ff0000', particles: 'blood', speed: 2 },
            'infinite void': { color: '#00ffff', particles: 'stars', speed: 1 },
            'chimera shadow garden': { color: '#8b0000', particles: 'shadows', speed: 1.5 },
            'disaster flames': { color: '#ff4500', particles: 'fire', speed: 3 },
            'ice formation': { color: '#00bfff', particles: 'ice', speed: 0.8 },
            'hollow purple': { color: '#800080', particles: 'void', speed: 4 }
        };
        
        this.currentDomain = null;
        this.recognition = null;
        this.hands = new Hands({locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});
        this.camera = null;
        
        this.init();
    }

    init() {
        this.setupVoice();
        this.setupHands();
        this.setupThreeJS();
        this.updateUI('🔥 Voice & Hands Ready! Say "Domain Expansion [name]"');
    }

    setupVoice() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.onresult = (event) => this.onVoiceCommand(event);
            this.recognition.start();
        }
    }

    onVoiceCommand(event) {
        const command = event.results[0][0].transcript.toLowerCase();
        console.log('Voice:', command);
        
        if (command.includes('domain expansion')) {
            const domainName = command.split('domain expansion')[1]?.trim();
            const domain = Object.keys(this.domains).find(key => 
                domainName.includes(key.replace(/ /g, '')) || key.includes(domainName)
            );
            
            if (domain) {
                this.activateDomain(domain);
            }
        }
    }

    setupHands() {
        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.5
        });
        
        this.hands.onResults(this.onHandResults.bind(this));
        
        const video = document.getElementById('video');
        this.camera = new Camera(video, {
            onFrame: async () => {
                await this.hands.send({image: video});
            },
            width: 640,
            height: 480
        });
        this.camera.start();
    }

    onHandResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
            const landmarks = results.multiHandLandmarks[0];
            // Check for open palm gesture (thumb + 4 fingers extended)
            const fingersUp = this.countFingers(landmarks);
            if (fingersUp >= 5) {
                this.updateUI('✋ Hand detected - Ready for voice command!');
            }
        }
    }

    countFingers(landmarks) {
        // Simple finger counting logic
        let fingers = 0;
        // Thumb, index, middle, ring, pinky checks
        if (landmarks[4].y < landmarks[3].y) fingers++; // Thumb
        if (landmarks[8].y < landmarks[6].y) fingers++; // Index
        if (landmarks[12].y < landmarks[10].y) fingers++; // Middle
        if (landmarks[16].y < landmarks[14].y) fingers++; // Ring
        if (landmarks[20].y < landmarks[18].y) fingers++; // Pinky
        return fingers;
    }

    setupThreeJS() {
        const canvas = document.getElementById('canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        camera.position.z = 5;
        this.scene = scene;
        this.camera3D = camera;
        this.renderer = renderer;
        
        this.animate();
    }

    activateDomain(domainName) {
        this.currentDomain = this.domains[domainName];
        this.updateUI(`🌌 DOMAIN EXPANSION: ${domainName.toUpperCase()} ACTIVATED!`);
        
        document.body.classList.add('domain-active');
        // Trigger particle effects, color shifts, etc.
        this.createDomainEffect();
        
        // Auto-deactivate after 10s
        setTimeout(() => this.deactivateDomain(), 10000);
    }

    createDomainEffect() {
        // Create epic particle explosion
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < 1000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({
            color: this.currentDomain.color,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate explosion
        const animateParticles = () => {
            particles.rotation.x += 0.01;
            particles.rotation.y += 0.01;
            if (particles.material.opacity > 0) {
                particles.material.opacity -= 0.005;
                requestAnimationFrame(animateParticles);
            } else {
                this.scene.remove(particles);
            }
        };
        animateParticles();
    }

    deactivateDomain() {
        this.currentDomain = null;
        document.body.classList.remove('domain-active');
        this.updateUI('Ready for next Domain Expansion...');
    }

    updateUI(message) {
        document.getElementById('status').textContent = message;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera3D);
    }
}

