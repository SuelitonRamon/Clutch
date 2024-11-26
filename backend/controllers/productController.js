const { Product } = require('../models');
const path = require('path');

// Função para criar um novo produto
const createProduct = async (req, res) => {
  try {
    const { nome, descricao, avaliacao, preco, categoria, trailer } = req.body;

    // Criação do produto no banco de dados
    const newProduct = await Product.create({
      nome,
      descricao,
      avaliacao,
      preco,
      categoria,
      trailer
    });

    // Obtemos os caminhos dos arquivos de imagem gerados pelo Multer
    const capa = req.files['capa'] ? 'uploads/' + req.files['capa'][0].filename : null;
    const img_1 = req.files['img_1'] ? 'uploads/' + req.files['img_1'][0].filename : null;
    const img_2 = req.files['img_2'] ? 'uploads/' + req.files['img_2'][0].filename : null;
    const img_3 = req.files['img_3'] ? 'uploads/' + req.files['img_3'][0].filename : null;

    // Atualiza o produto com os caminhos das imagens
    await newProduct.update({
      capa,
      img_1,
      img_2,
      img_3
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar produto.' });
  }
};


// Função para listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao obter produtos.' });
  }
};

// Função para obter um produto específico pelo ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao obter produto.' });
  }
};

const filterProducts = async (req, res) => {
  const { categoria } = req.query;
  
  try{
    console.log(req.query);
    const products = await Product.findAll({where: { categoria }});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Nenhum produto encontrado.' });
    }
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao obter produto.' })
  }
}

// Função para atualizar um produto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID do produto a ser atualizado
    const { nome, descricao, avaliacao, preco, categoria, trailer } = req.body;

    // Busca o produto no banco
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Atualiza os campos fornecidos
    const updatedData = {
      nome,
      descricao,
      avaliacao,
      preco,
      categoria,
      trailer
    };

    // Verifica se há novas imagens e atualiza os caminhos
    const capa = req.files && req.files['capa'] ? 'uploads/' + req.files['capa'][0].filename : product.capa;
    const img_1 = req.files && req.files['img_1'] ? 'uploads/' + req.files['img_1'][0].filename : product.img_1;
    const img_2 = req.files && req.files['img_2'] ? 'uploads/' + req.files['img_2'][0].filename : product.img_2;
    const img_3 = req.files && req.files['img_3'] ? 'uploads/' + req.files['img_3'][0].filename : product.img_3;

    // Adiciona as imagens ao objeto de atualização
    updatedData.capa = capa;
    updatedData.img_1 = img_1;
    updatedData.img_2 = img_2;
    updatedData.img_3 = img_3;

    // Atualiza o produto no banco de dados
    await product.update(updatedData);

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar o produto.' });
  }
};


// Função para excluir um produto
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // Excluindo o produto
    await product.destroy();

    return res.status(200).json({ message: 'Produto excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao excluir produto.' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  filterProducts,
  updateProduct,
  deleteProduct
};