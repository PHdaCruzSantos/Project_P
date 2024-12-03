<template>
  <div class="animation-container">
    <div class="truck" :class="{ 'is-moving': isTruckMoving }">
      <div class="truck-body"></div>
      <div class="truck-wheels">
        <div class="wheel"></div>
        <div class="wheel"></div>
      </div>
    </div>
    <div class="package" :class="{ 'is-moving': isPackageMoving }"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTruckMoving: false,
      isPackageMoving: false,
    };
  },
  methods: {
    startAnimation() {
      this.isPackageMoving = true;

      // Temporizador para sincronizar o caminhão após o pacote
      setTimeout(() => {
        this.isTruckMoving = true;
      }, 1000);

      // Reiniciar a animação após completar
      setTimeout(() => {
        this.isTruckMoving = false;
        this.isPackageMoving = false;
      }, 4000); // Duração total da animação
    },
  },
  mounted() {
    // Começar a animação automaticamente ao carregar
    this.startAnimation();

    // Repetir a animação a cada 5 segundos
    setInterval(() => {
      this.startAnimation();
    }, 5000);
  },
};
</script>

<style scoped>
.animation-container {
  position: relative;
  width: 400px;
  height: 200px;
  margin: 0 auto;
  background-color: #f0f0f0;
  overflow: hidden;
}

.truck {
  position: absolute;
  bottom: 50px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
  height: 50px;
  background-color: #3498db;
  border-radius: 5px;
  transition: transform 2s ease-in-out;
}

.truck.is-moving {
  transform: translateX(200px);
}

.truck-body {
  width: 100%;
  height: 40px;
  background-color: #2980b9;
  border-radius: 5px 5px 0 0;
}

.truck-wheels {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 10px;
  margin-top: 5px;
}

.wheel {
  width: 15px;
  height: 15px;
  background-color: #2c3e50;
  border-radius: 50%;
}

.package {
  position: absolute;
  bottom: 50px;
  left: 50px;
  width: 30px;
  height: 30px;
  background-color: #e74c3c;
  border-radius: 3px;
  transition: transform 1s ease-in-out, opacity 0.5s ease-in-out;
}

.package.is-moving {
  transform: translateX(30px);
  opacity: 0;
}
</style>
