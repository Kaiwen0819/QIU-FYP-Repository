document.addEventListener("DOMContentLoaded", function() {
    const stairContainer = document.querySelector(".stair-container");
    const numStairs = 21;

    // 确保容器为空，再次填充柱子
    stairContainer.innerHTML = "";
    for (let i = 0; i < numStairs; i++) {
        let stair = document.createElement("div");
        stair.classList.add("stair");
        stairContainer.appendChild(stair);
    }

    const stairs = document.querySelectorAll(".stair");
    const middleIndex = Math.floor(numStairs / 2);
    let cycleTime = 1200;

    function raiseStairs() {
        stairs.forEach((stair, index) => {
            let delay = Math.abs(index - middleIndex) * 100;
            setTimeout(() => {
                stair.style.height = "150px";
                stair.style.opacity = "1";
                stair.style.transition = "height 0.5s ease-in-out, opacity 0.5s ease-in-out";
            }, delay);
        });

        // 3秒后消失，并重新开始动画
        setTimeout(() => {
            stairs.forEach((stair, index) => {
                let delay = Math.abs(index - middleIndex) * 100;
                setTimeout(() => {
                    stair.style.height = "0px";
                    stair.style.opacity = "0";
                }, delay);
            });
            setTimeout(raiseStairs, 500);
        }, cycleTime);
    }

    raiseStairs();
});
