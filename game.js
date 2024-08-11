let scene, camera, renderer;
let player, cubes = [];
let score = 0;
let gameOver = false;

function init() {
    // Создаем сцену
    scene = new THREE.Scene();
    
    // Создаем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Создаем рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Создаем игрока
    const playerGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = -2; // Позиция игрока
    scene.add(player);

    // Запускаем цикл игры
    animate();
    
    // Запускаем генерацию кубов
    setInterval(createCube, 1000);

    // Управляем игроком
    window.addEventListener('keydown', movePlayer);
    window.addEventListener('touchstart', handleTouchStart);
}

function createCube() {
    if (gameOver) return;

    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    
    cube.position.x = Math.random() * 4 - 2; // Случайная позиция по оси X
    cube.position.y = 5; // Начальная позиция по оси Y
    cubes.push(cube);
    scene.add(cube);
}

function movePlayer(event) {
    if (gameOver) return;

    if (event.key === 'ArrowLeft' && player.position.x > -2) {
        player.position.x -= 0.1;
    } else if (event.key === 'ArrowRight' && player.position.x < 2) {
        player.position.x += 0.1;
    }
}

function handleTouchStart(event) {
    if (gameOver) return;

    const touchX = event.touches[0].clientX;
    const screenWidth = window.innerWidth;

    if (touchX < screenWidth / 2 && player.position.x > -2) {
        player.position.x -= 0.1; // Влево
    } else if (touchX >= screenWidth / 2 && player.position.x < 2) {
        player.position.x += 0.1; // Вправо
    }
}

function animate() {
    if (gameOver) return;

    // Движение кубов вниз
    for (let i = cubes.length - 1; i >= 0; i--) {
        cubes[i].position.y -= 0.05;

        // Проверка на столкновение
        if (cubes[i].position.y < -3) {
            scene.remove(cubes[i]);
            cubes.splice(i, 1);
            score++; // Увеличиваем счет за выживание
        } else if (cubes[i].position.y < player.position.y + 0.25 &&
                   cubes[i].position.y > player.position.y - 0.25 &&
                   cubes[i].position.x < player.position.x + 0.25 &&
                   cubes[i].position.x > player.position.x - 0.25) {
            gameOver = true;
            alert("Игра окончена! Ваш счет: " + score);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Адаптивный рендеринг
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
