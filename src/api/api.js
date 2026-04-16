import axios from "axios";

const API_BASE_URL = "https://verbo-vivo-backend.onrender.com"; // Base URL do backend

const sanitizeInput = (input) => {
  // Filtra apenas caracteres alfanuméricos e espaços
  return input.replace(/[^a-zA-Z0-9\s]/g, "");
};

// Função para buscar versículos
export const fetchVersiculos = async (searchTerm, page = 1, limit = 5) => {
  try {
    const sanitizedTerm = sanitizeInput(searchTerm);
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { word: sanitizedTerm, page, limit },
    });

    if (
      Array.isArray(response.data.versiculos) &&
      response.data.versiculos.length === 0 &&
      response.data.total === 0
    ) {
      return {
        versiculos: [],
        total: 0,
        error:
          "Nada foi encontrado para sua pesquisa. Use palavras simples, como 'amor', 'fé' ou 'esperança'.",
      };
    }

    return {
      versiculos: response.data.versiculos || [],
      total: response.data.total || 0,
      totalPages: response.data.total_pages || 1,
      error: null,
    };
  } catch (error) {
    let errorMessage;

    // Tratamento para status 429
    if (error.response?.status === 429) {
      errorMessage =
        "Você realizou muitas buscas em pouco tempo. Aguarde um momento e tente novamente. 😊";
    } else {
      // Mensagem genérica para outros erros
      errorMessage =
        error.response?.data?.message ||
        "Erro na conexão. Por favor, tente novamente.";
    }

    return {
      versiculos: [],
      total: 0,
      error: errorMessage,
    };
  }
};


// Função para buscar dados do usuário
export const fetchUserData = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, {
      params: { email },
    });
    return response.data; // Retorna os dados do usuário
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Erro ao buscar dados do usuário. Tente novamente.";
    throw new Error(errorMessage);
  }
};

// Função para login de usuário
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Ops! E-mail ou senha inválidos. Tente novamente. 😊";
    throw new Error(errorMessage);
  }
};

// Função para cadastrar usuário
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // Tratar caso de conflito de email já existente
      const errorMessage =
        "Este e-mail já está cadastrado. Por favor, use outra senha ou tente fazer login.";
      throw new Error(errorMessage);
    }

    const fallbackMessage =
      error.response?.data?.message ||
      "Erro ao tentar cadastrar usuário. Verifique os dados e tente novamente. 😊";
    throw new Error(fallbackMessage);
  }
};
