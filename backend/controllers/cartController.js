const { Cart, CartItem, Product, User } = require('../models');

const cartController = {
  // Criar ou recuperar carrinho ativo
  async getOrCreateCart(req, res) {
    try {
      const usuarioId = req.usuario.id;

      let cart = await Cart.findOne({
        where: { 
          usuarioId,
          status: 'ativo'
        },
        include: [{
          model: CartItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      if (!cart) {
        cart = await Cart.create({
          usuarioId,
          status: 'ativo',
          total: 0
        });
      }

      res.json(cart);
    } catch (error) {
      console.error('Erro ao buscar/criar carrinho:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Adicionar item ao carrinho
  async addItem(req, res) {
    try {
      const { productId, quantidade } = req.body;
      const usuarioId = req.usuario.id;
      // Validar dados de entrada
      if (!productId || !quantidade) {
        return res.status(400).json({ error: 'ProductId e quantidade são obrigatórios' });
      }

      // Buscar ou criar carrinho ativo
      let [cart] = await Cart.findOrCreate({
        where: { 
          usuarioId,
          status: 'ativo'
        },
        defaults: {
          total: 0
        }
      });

      // Buscar produto
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Verificar se o item já existe no carrinho
      let cartItem = await CartItem.findOne({
        where: {
          cartId: cart.id,
          productId
        }
      });

      if (cartItem) {
        // Atualizar quantidade se já existe
        cartItem.quantidade += quantidade;
        cartItem.precoUnitario = product.preco;
        await cartItem.save();
      } else {
        // Criar novo item se não existe
        cartItem = await CartItem.create({
          cartId: cart.id,
          productId,
          quantidade,
          precoUnitario: product.preco
        });
      }

      // Recalcular total do carrinho
      await cartController.updateCartTotal(cart.id);

      // Retornar carrinho atualizado
      const updatedCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Atualizar quantidade de um item
  async updateItemQuantity(req, res) {
    try {
      const { cartItemId, quantidade } = req.body;
      const usuarioId = req.usuario.id;

      if (!cartItemId || quantidade === undefined) {
        return res.status(400).json({ error: 'CartItemId e quantidade são obrigatórios' });
      }

      const cartItem = await CartItem.findByPk(cartItemId, {
        include: [{
          model: Cart,
          as: 'cart'
        }]
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      // Verificar se o carrinho pertence ao usuário
      if (cartItem.cart.usuarioId !== usuarioId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      if (quantidade <= 0) {
        await cartItem.destroy();
      } else {
        cartItem.quantidade = quantidade;
        await cartItem.save();
      }

      await cartController.updateCartTotal(cartItem.cartId);

      const updatedCart = await Cart.findByPk(cartItem.cartId, {
        include: [{
          model: CartItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Método auxiliar para atualizar o total do carrinho
  async updateCartTotal(cartId) {
    try {
      const cartItems = await CartItem.findAll({
        where: { cartId }
      });

      const total = cartItems.reduce((sum, item) => {
        return sum + (item.quantidade * item.precoUnitario);
      }, 0);

      await Cart.update({ total }, { where: { id: cartId } });
    } catch (error) {
      console.error('Erro ao atualizar total do carrinho:', error);
      throw error;
    }
  },

  // Remover item do carrinho
  async removeItem(req, res) {
    try {
      // Verificar se temos o usuário

      const { cartItemId } = req.params;
      const usuarioId = req.usuario.id;

      if (!cartItemId) {
        return res.status(400).json({ error: 'CartItemId é obrigatório' });
      }

      const cartItem = await CartItem.findByPk(cartItemId, {
        include: [{
          model: Cart,
          as: 'cart'
        }]
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      if (cartItem.cart.usuarioId !== usuarioId) {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      await cartItem.destroy();
      await cartController.updateCartTotal(cartItem.cartId);

      const updatedCart = await Cart.findByPk(cartItem.cartId, {
        include: [{
          model: CartItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      res.json(updatedCart);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Simular finalização da compra
  async checkout(req, res) {
    try {
      // Verificar se temos o usuário

      const usuarioId = req.usuario.id;
      
      // Buscar carrinho ativo
      const cart = await Cart.findOne({
        where: { 
          usuarioId,
          status: 'ativo'
        },
        include: [{
          model: CartItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      if (!cart) {
        return res.status(404).json({ error: 'Carrinho não encontrado' });
      }

      if (cart.itens.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio' });
      }

      // Simular processo de pagamento
      const pagamentoSimulado = {
        status: 'aprovado',
        transactionId: `TRANS_${Date.now()}`,
        valor: cart.total,
        data: new Date()
      };

      // Finalizar carrinho
      await Cart.update(
        { 
          status: 'finalizado',
          updatedAt: new Date()
        },
        { where: { id: cart.id } }
      );

      // Retornar confirmação
      res.json({
        mensagem: 'Compra finalizada com sucesso',
        pedido: {
          id: cart.id,
          itens: cart.itens,
          total: cart.total,
          pagamento: pagamentoSimulado
        }
      });
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = cartController;