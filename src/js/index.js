Vue.createApp({
  data() {
    return {
      cards: [
        {
          id: 1,
          previews: ['./img/prw1-0.png', './img/prw1-1.jpg', './img/prw1-2.jpg'],
          title: '«Рождение Венеры» Сандро Боттичелли',
          price: '2 000 000 $',
          oldPrice: '1 000 000 $',
          description: 'lorem ipsum dollar set amet',
          isSold: false,
          statusTitle: '',
          isProcessing: false
        },
        {
          id: 2,
          previews: ['./img/prw1-0.png', './img/prw1-1.jpg', './img/prw1-2.jpg'],
          title: '«Тайная вечеря»  Леонардо да Винчи',
          price: '3 000 000 $',
          oldPrice: '',
          description: 'Венера, стоя в раковине, плывет, подгоняемая Зефиром и Хлоридой, а навстречу ей идет Ора, одна из спутниц богини, которая держит покрывало, чтобы окутать ее. Трепещущие на ветру прихотливые складки покрывала и одежд, волны на море, изломанная линия берега, «гофрированная» створка раковины, наконец летящие волосы Венеры - все это оттеняет плавные очертания тела богини и усиливает то чувство высшей гармонии, которое вызывает ее облик.',
          isSold: false,
          statusTitle: '',
          isProcessing: false
        },
        {
          id: 3,
          previews: ['./img/prw1-0.png', './img/prw1-1.jpg', './img/prw1-2.jpg'],
          title: '«Сотворение Адама» Микеланджело',
          price: '6 000 000 $',
          oldPrice: '5 000 000 $',
          description: 'Венера, стоя в раковине, плывет, подгоняемая Зефиром и Хлоридой, а навстречу ей идет Ора, одна из спутниц богини, которая держит покрывало, чтобы окутать ее. Трепещущие на ветру прихотливые складки покрывала и одежд, волны на море, изломанная линия берега, «гофрированная» створка раковины, наконец летящие волосы Венеры - все это оттеняет плавные очертания тела богини и усиливает то чувство высшей гармонии, которое вызывает ее облик.',
          isSold: false,
          statusTitle: '',
          isProcessing: false
        },
        {
          id: 4,
          previews: ['./img/prw1-0.png', './img/prw1-1.jpg', './img/prw1-2.jpg'],
          title: '«Урок анатомии»  Рембрандт',
          price: '2 000 000 $',
          oldPrice: '1 000 000 $',
          description: 'Венера, стоя в раковине, плывет, подгоняемая Зефиром и Хлоридой, а навстречу ей идет Ора, одна из спутниц богини, которая держит покрывало, чтобы окутать ее. Трепещущие на ветру прихотливые складки покрывала и одежд, волны на море, изломанная линия берега, «гофрированная» створка раковины, наконец летящие волосы Венеры - все это оттеняет плавные очертания тела богини и усиливает то чувство высшей гармонии, которое вызывает ее облик.',
          isSold: true,
          statusTitle: 'Продана на аукционе',
          isProcessing: false
        }
      ],
      cart: {},
      inputValue: '',
      searchedValue: '',
      inputIsProcessing: false,
      menuShown: false,
      modalShown: false,
      modalData: {}
    };
  },
  mounted() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  },
  methods: {
    toggleMenu() {
      this.menuShown = !this.menuShown;
    },
    searchItems() {
      this.inputIsProcessing = true;
      setTimeout(() => {
        this.inputIsProcessing = false;
        this.searchedValue = this.inputValue;

        localStorage.setItem('searchedValue', this.searchedValue);
      }, 500);
    },
    addInCart(product) {
      product.isProcessing = true;
      setTimeout(() => {
        product.isProcessing = false;
        this.cart[product.id] = 1;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }, 2000);
    },
    removeFromCart(product) {
      product.isProcessing = true;
      setTimeout(() => {
        product.isProcessing = false;
        delete this.cart[product.id];

        localStorage.setItem('cart', JSON.stringify(this.cart));
      }, 2000);
    },
    openModal(card) {
      this.modalShown = true;
      this.modalData = card;
      console.log(this.modalData);
      this.modalData.currentSlide = 0;
    },
    nextSlide() {
      const { modalData } = this;
      const countSlides = modalData.previews.length;
      if(modalData.currentSlide === countSlides - 1) return;
      ++modalData.currentSlide;
    },
    prevSlide() {
      const { modalData } = this;
      if(modalData.currentSlide === 0) return;
      --modalData.currentSlide;
    }
  },
  computed: {
    filteredCards() {
      const value = this.searchedValue.toLowerCase();
      if(value === '') return this.cards;
      return this.cards.filter((card) => {
          return card.title.toLowerCase().indexOf(value) !== -1;
      });
    },
  }
}).mount('#app');