/**
 * Capitaliza uma string (primeira letra maiúscula, resto minúscula).
 * @param {string} palavra A string a ser capitalizada.
 * @returns {string} A string no formato "Capitalizado".
 */
function capitalize(palavra) {
  if (!palavra) return "";
  const primeiraLetra = palavra[0].toUpperCase();
  const restoDaPalavra = palavra.slice(1).toLowerCase();
  return primeiraLetra + restoDaPalavra;
}

/**
 * Verifica se uma pessoa possui todos os brinquedos favoritos de um animal,
 * respeitando a ordem e permitindo outros brinquedos no meio (Regras 1 e 2).
 * @param {string[]} brinquedosDoAnimal A lista de brinquedos do animal.
 * @param {string[]} brinquedosDaPessoa A lista de brinquedos da pessoa.
 * @returns {boolean} True se a pessoa tiver os brinquedos na ordem correta.
 */
function temBrinquedosNaOrdem(brinquedosDoAnimal, brinquedosDaPessoa) {
  let indiceBrinquedoAnimal = 0;
  for (let i = 0; i < brinquedosDaPessoa.length; i++) {
    if (brinquedosDaPessoa[i] === brinquedosDoAnimal[indiceBrinquedoAnimal]) {
      indiceBrinquedoAnimal++;
    }
    if (indiceBrinquedoAnimal === brinquedosDoAnimal.length) {
      return true;
    }
  }
  return false;
}

/**
 * Valida a lista de brinquedos de uma pessoa, checando se os brinquedos existem
 * e se não há duplicatas na lista de entrada.
 * @param {string[]} listaBrinquedos A lista de brinquedos da pessoa.
 * @param {object[]} animaisDisponiveis A lista de todos os animais do abrigo.
 * @returns {boolean} True se a lista de brinquedos for válida.
 */
function validarBrinquedos(listaBrinquedos, animaisDisponiveis) {
  const todosBrinquedos = animaisDisponiveis.flatMap(
    (animal) => animal.brinquedos
  );
  const setBrinquedos = new Set();
  for (const brinquedo of listaBrinquedos) {
    if (!todosBrinquedos.includes(brinquedo)) return false; // Brinquedo não existe
    if (setBrinquedos.has(brinquedo)) return false; // Brinquedo duplicado
    setBrinquedos.add(brinquedo);
  }
  return true;
}

/**
 * Valida a lista de animais para adoção, checando se não há nomes duplicados.
 * @param {string[]} ordemAnimais A lista de nomes de animais a serem processados.
 * @returns {boolean} True se a lista de animais for válida.
 */
function validarAnimaisNaOrdem(ordemAnimais) {
  const setAnimais = new Set();
  for (const animal of ordemAnimais) {
    if (setAnimais.has(animal)) return false;
    setAnimais.add(animal);
  }
  return true;
}

/**
 * Verifica se uma pessoa possui todos os brinquedos de um animal, sem se importar com a ordem.
 * Usado para a regra especial do Loco.
 * @param {string[]} brinquedosDoAnimal A lista de brinquedos do animal.
 * @param {string[]} brinquedosDaPessoa A lista de brinquedos da pessoa.
 * @returns {boolean} True se a pessoa tiver todos os brinquedos.
 */
function temTodosOsBrinquedos(brinquedosDoAnimal, brinquedosDaPessoa) {
  return brinquedosDoAnimal.every((brinquedo) =>
    brinquedosDaPessoa.includes(brinquedo)
  );
}

class AbrigoAnimais {
  animaisDisponiveis = [
    { nome: "Rex", especie: "cão", brinquedos: ["RATO", "BOLA"] },
    { nome: "Mimi", especie: "gato", brinquedos: ["BOLA", "LASER"] },
    { nome: "Fofo", especie: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
    { nome: "Zero", especie: "gato", brinquedos: ["RATO", "BOLA"] },
    { nome: "Bola", especie: "cão", brinquedos: ["CAIXA", "NOVELO"] },
    { nome: "Bebe", especie: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
    { nome: "Loco", especie: "jabuti", brinquedos: ["SKATE", "RATO"] },
  ];

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const brinquedosPessoa1Str = brinquedosPessoa1;
    const brinquedosPessoa2Str = brinquedosPessoa2;
    const ordemAnimaisStr = ordemAnimais;

    let listaBrinquedosPessoa1 = brinquedosPessoa1Str
      .split(",")
      .map((brinquedo) => brinquedo.trim().toUpperCase());
    let listaBrinquedosPessoa2 = brinquedosPessoa2Str
      .split(",")
      .map((brinquedo) => brinquedo.trim().toUpperCase());
    const nomesDosAnimaisParaAdocao = ordemAnimaisStr
      .split(",")
      .map((animal) => capitalize(animal.trim()));

    if (
      !validarBrinquedos(listaBrinquedosPessoa1, this.animaisDisponiveis) ||
      !validarBrinquedos(listaBrinquedosPessoa2, this.animaisDisponiveis)
    ) {
      return { erro: "Brinquedo inválido" };
    }
    if (!validarAnimaisNaOrdem(nomesDosAnimaisParaAdocao)) {
      return { erro: "Animal inválido" };
    }

    const relatorioFinal = [];
    let contadorAdotadosPessoa1 = 0;
    let contadorAdotadosPessoa2 = 0;

    // A lógica de adoção é feita em duas passagens para lidar com a regra especial do Loco,
    // que depende do estado de adoção de outros animais.

    // --- PASSAGEM 1: Processa todos os animais, exceto o Loco ---
    for (const nomeDoAnimal of nomesDosAnimaisParaAdocao) {
      if (nomeDoAnimal === "Loco") {
        continue;
      }

      const animalAtual = this.animaisDisponiveis.find(
        (animal) => animal.nome === nomeDoAnimal
      );
      if (!animalAtual) return { erro: "Animal inválido" };

      const pessoa1PodeAdotar =
        temBrinquedosNaOrdem(animalAtual.brinquedos, listaBrinquedosPessoa1) &&
        contadorAdotadosPessoa1 < 3;
      const pessoa2PodeAdotar =
        temBrinquedosNaOrdem(animalAtual.brinquedos, listaBrinquedosPessoa2) &&
        contadorAdotadosPessoa2 < 3;

      let donoFinal;
      if (pessoa1PodeAdotar && pessoa2PodeAdotar) {
        donoFinal = "abrigo";
      } else if (pessoa1PodeAdotar) {
        donoFinal = "pessoa 1";
        contadorAdotadosPessoa1++;
        // Implementa a Regra 3: Gatos não dividem brinquedos.
        if (animalAtual.especie === "gato") {
          listaBrinquedosPessoa1 = listaBrinquedosPessoa1.filter(
            (brinquedo) => !animalAtual.brinquedos.includes(brinquedo)
          );
        }
      } else if (pessoa2PodeAdotar) {
        donoFinal = "pessoa 2";
        contadorAdotadosPessoa2++;
        // Implementa a Regra 3: Gatos não dividem brinquedos.
        if (animalAtual.especie === "gato") {
          listaBrinquedosPessoa2 = listaBrinquedosPessoa2.filter(
            (brinquedo) => !animalAtual.brinquedos.includes(brinquedo)
          );
        }
      } else {
        donoFinal = "abrigo";
      }
      relatorioFinal.push(animalAtual.nome + " - " + donoFinal);
    }

    // --- PASSAGEM 2: Processa apenas o Loco, agora que os outros já foram definidos ---
    for (const nomeDoAnimal of nomesDosAnimaisParaAdocao) {
      if (nomeDoAnimal !== "Loco") {
        continue;
      }

      const animalAtual = this.animaisDisponiveis.find(
        (animal) => animal.nome === nomeDoAnimal
      );
      if (!animalAtual) return { erro: "Animal inválido" };

      // Implementa a Regra 6: Loco precisa de companhia (contador > 0).
      const pessoa1PodeAdotar =
        contadorAdotadosPessoa1 > 0 &&
        temTodosOsBrinquedos(animalAtual.brinquedos, listaBrinquedosPessoa1) &&
        contadorAdotadosPessoa1 < 3;
      const pessoa2PodeAdotar =
        contadorAdotadosPessoa2 > 0 &&
        temTodosOsBrinquedos(animalAtual.brinquedos, listaBrinquedosPessoa2) &&
        contadorAdotadosPessoa2 < 3;

      let donoFinal;
      if (pessoa1PodeAdotar && pessoa2PodeAdotar) {
        donoFinal = "abrigo";
      } else if (pessoa1PodeAdotar) {
        donoFinal = "pessoa 1";
        contadorAdotadosPessoa1++;
      } else if (pessoa2PodeAdotar) {
        donoFinal = "pessoa 2";
        contadorAdotadosPessoa2++;
      } else {
        donoFinal = "abrigo";
      }
      relatorioFinal.push(animalAtual.nome + " - " + donoFinal);
    }

    return { lista: relatorioFinal.sort() };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
