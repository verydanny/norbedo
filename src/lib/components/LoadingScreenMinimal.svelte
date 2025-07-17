<style lang="css">
    .scene {
        perspective: 1000px;
    }

    .text-3d {
        display: flex;
        gap: 1rem;
        transform-style: preserve-3d;
        animation: rotate 12s linear infinite;
        padding: 2rem;
    }

    @media (max-width: 640px) {
        .text-3d {
            gap: 0.5rem;
            padding: 1rem;
        }
    }

    .letter {
        display: inline-block;
        font-size: 5rem;
        line-height: 1;
        font-weight: 900;
        color: #8b0e91;
        transform-style: preserve-3d;
        animation: float 3s ease-in-out calc(var(--index) * 0.1s) infinite;
        position: relative;
        z-index: 10;
        /* Glow effect */
        filter: drop-shadow(0 0 20px rgba(21, 10, 93, 0.6));
    }

    @media (max-width: 640px) {
        .letter {
            font-size: 3rem;
        }
    }

    @keyframes rotate {
        from {
            transform: rotateY(-20deg) rotateX(5deg);
        }
        to {
            transform: rotateY(340deg) rotateX(5deg);
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
</style>

<div class="bg-base-300 fixed inset-0 flex items-center justify-center overflow-hidden">
    <div class="scene">
        <div class="text-3d">
            {#each 'norbedo'.split('') as letter, i}
                <span class="letter" style="--index: {i}">
                    {letter}
                </span>
            {/each}
        </div>
    </div>
</div>
