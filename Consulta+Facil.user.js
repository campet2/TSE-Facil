// ==UserScript==
// @name         TSE Consulta +Fácil
// @version      6.1
// @description  A boa das boas!
// @author       Davi Moura & Davi Menegol
// @match        https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jus.br
// @grant        none
// ==/UserScript==

;(function () {
  // Redirecionar para a página correta
  location.href =
    "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor/consultar-numero-titulo-eleitor"

  // Limpar todos os cookies, exceto aqueles com prefixo 'tse_'
  function limparCookies() {
      document.cookie.split(";").forEach((cookie) => {
          const cookieName = cookie.split("=")[0].trim();
          if (!cookieName.startsWith("tse_")) {
            document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          }
        });
  }
  limparCookies()

  // Limpar todos os itens do localStorage, exceto aqueles com prefixo 'tse_'
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("tse_")) {
      localStorage.removeItem(key);
    }
  });

  // Função para esperar um elemento aparecer
  function waitElement(selector, callback) {
    var el = document.querySelector(selector)
    if (el) {
      callback(el)
    } else {
      setTimeout(function () {
        waitElement(selector, callback)
      }, 500)
    }
  }
  // Função para carregar dados do localStorage
  function carregarDados() {

    const nomeCompleto = localStorage.getItem("tse_nomeCompleto")
    const dataNascimento = localStorage.getItem("tse_dataNascimento")
    const nomeMae = localStorage.getItem("tse_nomeMae")
    const nomePai = localStorage.getItem("tse_nomePai")
    const tipoConsulta = localStorage.getItem("tse_tipoConsulta")

    //console.log(nomeCompleto,dataNascimento,nomeMae,nomePai,tipoConsulta)

    if (nomeCompleto) {
      const nomeCompletoInput = document.querySelector("#titulo-cpf-nome")
      nomeCompletoInput.style.whiteSpace = "pre-wrap";
      nomeCompletoInput.style.wordWrap = "break-word";
      nomeCompletoInput.style.wordBreak = "break-word";
      nomeCompletoInput.value = nomeCompleto
      nomeCompletoInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    if (dataNascimento) {
      const dataNascimentoInput = document.querySelector("input[formcontrolname='dataNascimento']")
      dataNascimentoInput.value = dataNascimento
      dataNascimentoInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    if (nomeMae) {
      const nomeMaeInput = document.querySelector("input[formcontrolname='nomeMae']")
      nomeMaeInput.value = nomeMae
      nomeMaeInput.dispatchEvent(new Event('input', { bubbles: true }))
    }
    if (nomePai) {
      const nomePaiInput = document.querySelector("input[formcontrolname='nomePai']")
      nomePaiInput.value = nomePai
      nomePaiInput.dispatchEvent(new Event('input', { bubbles: true }))
    }

    if(tipoConsulta){
      const tipoConsultaInput = document.querySelector("select[formcontrolname='tipoFiliacao']")
      tipoConsultaInput.value = tipoConsulta
      tipoConsultaInput.dispatchEvent(new Event('change', { bubbles: true }))
      //console.log("atualizou")
    }
  }
  //trata traços e espaços no cpf
  function tratarCpf(){
    var entrada = document.querySelector("#titulo-cpf-nome").value
    entrada = entrada.trim()
    if(!isNaN(parseInt(entrada[0]))){
      entrada = entrada.replaceAll("-","")
      entrada = entrada.replaceAll(".","")
      entrada = entrada.replaceAll(" ","")
      document.querySelector("#titulo-cpf-nome").value = entrada
      document.querySelector("#titulo-cpf-nome").dispatchEvent(new Event('input', { bubbles: true }))
    }

  }
  function salvarDados() {
    const nomeCompleto = document.querySelector("#titulo-cpf-nome").value
    const dataNascimento = document.querySelector("input[formcontrolname='dataNascimento']").value
    const nomeMae = document.querySelector("input[formcontrolname='nomeMae']").value
    const nomePai = document.querySelector("input[formcontrolname='nomePai']").value

    localStorage.setItem("tse_nomeCompleto", nomeCompleto)
    localStorage.setItem("tse_dataNascimento", dataNascimento)
    localStorage.setItem("tse_nomeMae", nomeMae)
    localStorage.setItem("tse_nomePai", nomePai)
    //console.log("DADOS SALVOS!")
  }
  //salvar tipo de consulta manualmente
  waitElement("select[formcontrolname='tipoFiliacao']", function (el){
      el.addEventListener('change', () => {
        localStorage.setItem('tse_tipoConsulta', el.value);
      });
    })


  waitElement(".modal-auth", function (el) {
    carregarDados()
    el.style.overflow = "auto"
    el.style['background-color'] = "white"
  })

  waitElement(".login-form-row > form", function (formEl) {
    //formEl.setAttribute('onsubmit', 'console.log("teste")')

    waitElement("#titulo-cpf-nome", function (el) {
      el.setAttribute('placeholder', "Nome Completo")
      el.style.display = "none"

      const inputType = localStorage.getItem("tse_inputType") || "textarea"
      // add another field that will replicate his value
      const newEl = document.createElement(inputType)
      newEl.id = "titulo-cpf-nome-clone"
      newEl.style.display = "block"
      newEl.style.whiteSpace = "pre-wrap"
      newEl.style.wordWrap = "break-word"
      newEl.style.wordBreak = "break-word"
      newEl.style.width = "100%"
      newEl.setAttribute('placeholder', "Nome Completo")
      newEl.value = el.value
      el.parentNode.insertBefore(newEl, el.nextSibling)
      newEl.addEventListener("input", function () {
        el.value = newEl.value
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })
    })
    waitElement("input[formcontrolname='nomeMae']", function (el) {
      el.style.display = "none"

      const inputType = localStorage.getItem("tse_inputType") || "textarea"
      const newEl = document.createElement(inputType)
      newEl.id = "nome-mae-clone"
      newEl.style.display = "block"
      newEl.style.whiteSpace = "pre-wrap"
      newEl.style.wordWrap = "break-word"
      newEl.style.wordBreak = "break-word"
      newEl.style.width = "100%"
      newEl.setAttribute('placeholder', "Nome da mãe")
      newEl.value = el.value
      el.parentNode.insertBefore(newEl, el.nextSibling)
      newEl.addEventListener("input", function () {
        el.value = newEl.value
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })
    })

    waitElement("input[formcontrolname='nomePai']", function (el) {
      el.style.display = "none"

      const inputType = localStorage.getItem("tse_inputType") || "textarea"
      const newEl = document.createElement(inputType)
      newEl.id = "nome-pai-clone"
      newEl.style.display = "block"
      newEl.style.whiteSpace = "pre-wrap"
      newEl.style.wordWrap = "break-word"
      newEl.style.wordBreak = "break-word"
      newEl.style.width = "100%"
      newEl.setAttribute('placeholder', "Nome do pai")
      newEl.value = el.value
      el.parentNode.insertBefore(newEl, el.nextSibling)
      newEl.addEventListener("input", function () {
        el.value = newEl.value
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })
    })

    // Esconder o modal LGPD
    waitElement('#modal-lgpd', function (el) {
      el.style.display = 'none'
    })

    // Esconder bloco de acesso
    waitElement(".bloco-acesso-e-titulo", function (el) {
      el.style.display = "none"
    })

    // Modificar os botões
    waitElement(".login-form-row > form > .menu-botoes", function (el) {
      // Esconder todos os elementos filhos
      el.querySelectorAll("*").forEach((el) => {
        el.style.display = "none"
      })
   // Mudar cor help data
      waitElement("input[formcontrolname='dataNascimento']", function (el) {
          el.addEventListener("input", function () {
          document.querySelector(".form-group-data-nascimento").querySelector("span.help-block").style.color = "gray"
        })
        el.dispatchEvent(new Event('input', { bubbles: true }))
      })



  // Tirar Algumas Opçoes de filiação
  waitElement("select[formcontrolname='tipoFiliacao']", function (el) {
    var el2 = Array.from(el.querySelectorAll("option"))
    el2.forEach((el) => {
      if(el.value != "UMA_MAE_UM_PAI" && el.value != "UMA_MAE" && el.value != "UM_PAI" && el.value != "NAO_HA_REGISTRO" )
      {el.remove()}
    })
    })



      var sendButton = document.createElement("button")
      sendButton.className = "btn-tse"
      sendButton.type = "button"
      sendButton.style = "color:white !important; width: 60%;background-color:#fed387 !important;"
      sendButton.innerHTML = "<b>Autenticar</b>"
      el.appendChild(sendButton)

      var clearButton = document.createElement("button")
      clearButton.className = "btn-tse"
      clearButton.style = "background-color: #1b305a !important;color:white !important;border:none !important;"
      clearButton.type = "button"
      clearButton.innerText = "Limpar"
      el.appendChild(clearButton)

      sendButton.addEventListener("click", function () {
        tratarCpf()
        salvarDados()
        document.querySelector(".menu-botoes > button[type='submit']").click()
      })

      clearButton.addEventListener("click", function () {
        const confirmation = confirm("Você tem certeza que deseja apagar tudo?")
        if (confirmation) {
            localStorage.removeItem("tse_nomeCompleto")
            localStorage.removeItem("tse_dataNascimento")
            localStorage.removeItem("tse_nomeMae")
            localStorage.removeItem("tse_nomePai")
            document.querySelector("#titulo-cpf-nome").value = ""
            document.querySelector("input[formcontrolname='dataNascimento']").value = ""
            document.querySelector("input[formcontrolname='nomeMae']").value = ""
            document.querySelector("input[formcontrolname='nomePai']").value = ""
            document.querySelector("#titulo-cpf-nome-clone").value = ""
            document.querySelector("#nome-mae-clone").value = ""
            document.querySelector("#nome-pai-clone").value = ""
            document.querySelector("span.help-block").style.display = "none"
        }
      })
    })

    // Criar o contêiner para consultas recentes abaixo do formulário
    var recentQueriesDiv = document.createElement("div")
    recentQueriesDiv.id = "recent-queries"
    recentQueriesDiv.style = "margin-top: 20px;"

    // Inserir o contêiner após o formulário
    formEl.parentNode.insertBefore(recentQueriesDiv, formEl.nextSibling)

    // Função para renderizar consultas recentes
    function renderRecentQueries() {
      let recentQueries = JSON.parse(localStorage.getItem('tse_recentQueries')) || []

      // Limpar conteúdo existente
      recentQueriesDiv.innerHTML = ''

      if (recentQueries.length === 0) {
        recentQueriesDiv.innerHTML = '<p>Nenhuma consulta recente.</p>'
      } else {
        // Criar um título
        var title = document.createElement('h3')
        title.innerText = 'Consultas Recentes:'
        recentQueriesDiv.appendChild(title)

        // Criar uma lista para exibir as consultas
        var list = document.createElement('ul')
        recentQueries.forEach(function(query) {
          var listItem = document.createElement('li')
          listItem.innerHTML = `<strong>${query.nome}</strong> - Título: ${query.titulo} - Situação: ${query.situacao} - Zona: ${query.zona} - UF: ${query.uf}`
          listItem.style.cursor = 'pointer'
          listItem.style['padding-top'] = '10px'
          listItem.style['padding-bottom'] = '10px'
          listItem.addEventListener('click', function() {
            displayResult(query)
          })
          list.appendChild(listItem)
        })
        recentQueriesDiv.appendChild(list)
      }
    }

    function renderSwitchInputTypeBtn() {
      var inputType = localStorage.getItem("tse_inputType") || "textarea"
      var switchInputType = document.createElement("a")
      // switchInputType.className = "btn-tse"
      // switchInputType.style = "background-color: #ff6257 !important;"
      switchInputType.type = "button"
      switchInputType.innerText = inputType === "textarea" ? "Alterar para Campos pequenos" : "Alterar para Campos grandes"
      recentQueriesDiv.appendChild(switchInputType)
      switchInputType.addEventListener("click", function () {
        salvarDados()
        const newInputType = inputType === "textarea" ? "input" : "textarea"
        localStorage.setItem("tse_inputType", newInputType)
        location.reload()
      })
    }

    // Chamar a função para renderizar consultas recentes
    renderRecentQueries()

    // Botão para limpar consultas recentes
    var clearRecentButton = document.createElement("button")
    clearRecentButton.className = "btn-tse"
    clearRecentButton.style = "background-color: #ff6257 !important; margin-top: 10px;"
    clearRecentButton.type = "button"
    clearRecentButton.innerText = "Limpar consultas recentes"
    recentQueriesDiv.appendChild(clearRecentButton)

    clearRecentButton.addEventListener("click", function () {
      const confirmation = confirm("Você tem certeza que deseja apagar as consultas recentes?")
      if (confirmation) {
          localStorage.removeItem("tse_recentQueries")
          renderRecentQueries()
      }
    })
    renderSwitchInputTypeBtn()
  })

  // Função para exibir o resultado
  const displayResult = (queryData) => {
    document.body.querySelectorAll("*").forEach((el) => {
      el.style.display = "none"
    })

    // Criar o div de resultado
    const resultDiv = document.createElement("div")
    resultDiv.style =
      "margin: 50px auto; padding: 20px; border: 2px solid #1b305a; border-radius: 10px; background-color: #f0f8ff; width: 80%; max-width: 600px; text-align: left; font-family: Arial, sans-serif; color: #333;"
    document.body.appendChild(resultDiv)

    // Preparar os dados para exibição
    const dataToShow = {
      Eleitor: queryData.nome,
      Título: queryData.titulo,
      Situação: queryData.situacao,
      UF: queryData.uf,
      Zona: queryData.zona,

    }

    // Verificar a situação e definir a cor
 

    const permitidas = {
  "AC": [],
  "AL": [],
  "AM": [],
  "AP": [],
  "BA": [
    "0001", "0002", "0003", "0004", "0005", "0006", "0007", "0008", "0009", "0010",
    "0011", "0012", "0013", "0014", "0015", "0016", "0017", "0018", "0019", "0030",
    "0033", "0090", "0141", "0170", "0171", "0178", "0180"
  ],
  "CE": [
    "0001", "0002", "0003", "0028", "0037", "0066", "0080", "0082", "0083", "0085",
    "0088", "0093", "0094", "0095", "0109", "0112", "0113", "0114", "0115", "0116",
    "0117", "0118", "0119", "0122", "0123"
  ],
  "DF": [
    "0002", "0004", "0005", "0006", "0008", "0009", "0010", "0013", "0016", "0017",
    "0018", "0019", "0021"
  ],
  "ES": [],
  "GO": [],
  "MA": [],
  "MG": [],
  "MS": [],
  "MT": [],
  "PA": [],
  "PB": [],
  "PE": [
    "0001", "0002", "0003", "0004", "0005", "0006", "0007", "0009", "0010", "0011",
    "0012", "0013", "0018", "0100", "0114", "0117", "0118", "0119", "0127", "0138",
    "0146", "0147", "0149", "0150"
  ],
  "PI": [],
  "PR": [],
  "RJ": [
    "0021", "0023", "0024", "0025", "0030", "0035", "0075", "0078", "0079", "0084",
    "0090", "0091", "0093", "0094", "0103", "0105", "0107", "0108", "0111", "0120",
    "0122", "0123", "0125", "0126", "0127", "0131", "0138", "0139", "0147", "0148",
    "0152", "0153", "0157", "0158", "0162", "0169", "0170", "0176", "0183", "0186",
    "0188", "0200", "0218", "0219", "0233", "0234", "0238", "0241", "0242", "0243",
    "0245", "0246"
  ],
  "RN": [],
  "RO": [],
  "RR": [],
  "RS": [],
  "SC": [
    "0002", "0012", "0013", "0024", "0029", "0084", "0100", "0107"
  ],
  "SE": [
    "0001", "0034", "0027", "0002", "0021"
  ],
  "SP": [
    "0001", "0002", "0003", "0004", "0005", "0006", "0018", "0020", "0033", "0038",
    "0046", "0050", "0059", "0065", "0066", "0074", "0075", "0090", "0093", "0110",
    "0130", "0131", "0142", "0156", "0158", "0166", "0174", "0176", "0181", "0183",
    "0185", "0186", "0189", "0192", "0199", "0201", "0212", "0213", "0217", "0219",
    "0222", "0227", "0237", "0242", "0244", "0246", "0247", "0248", "0249", "0250",
    "0251", "0252", "0253", "0254", "0255", "0256", "0257", "0258", "0259", "0260",
    "0263", "0267", "0268", "0269", "0270", "0272", "0274", "0275", "0276", "0277",
    "0278", "0279", "0280", "0281", "0283", "0284", "0286", "0287", "0288", "0296",
    "0303", "0304", "0306", "0307", "0315", "0319", "0320", "0323", "0324", "0325",
    "0326", "0327", "0328", "0329", "0331", "0332", "0335", "0339", "0340", "0341",
    "0344", "0346", "0347", "0348", "0349", "0350", "0351", "0352", "0353", "0354",
    "0355", "0356", "0359", "0361", "0362", "0365", "0367", "0370", "0371", "0372",
    "0373", "0374", "0375", "0376", "0377", "0378", "0379", "0380", "0381", "0382",
    "0383", "0384", "0386", "0388", "0389", "0390", "0391", "0392", "0393", "0394",
    "0395", "0397", "0399", "0401", "0403", "0404", "0405", "0406", "0408", "0409",
    "0412", "0413", "0414", "0415", "0416", "0417", "0418", "0419", "0420", "0421",
    "0422", "0423", "0424", "0426", "0428"
  ],
  "TO": []
}

    const situacao = queryData.situacao
    const situacaoColor = situacao === "REGULAR" ? "green" : "red"
    const zonaCor = permitidas[dataToShow.UF].includes("0"+dataToShow.Zona) ? "green" : "red"

  for (const key in dataToShow) {
      if (dataToShow.hasOwnProperty(key)) {

          const p = document.createElement("p")

          if(key === "Eleitor" || key == "Título"){
              p.innerHTML = `<strong>${key}:</strong> ${dataToShow[key]}`
          }

          //situacao
          else if (key === "Situação") {
              const valueSpan = document.createElement("span")
              valueSpan.style.color = situacaoColor
              valueSpan.innerText = dataToShow[key]
              p.innerHTML = `<strong>${key}:</strong> `
              p.appendChild(valueSpan)
          }

          //zonas e uf
          else if (key === "UF") {
              let UFSpan = document.createElement("span")
              UFSpan.style.color = zonaCor

              UFSpan.innerText = dataToShow.UF
              p.innerHTML = `<strong>${key}:</strong> `
              p.appendChild(UFSpan)

          }else if(key === "Zona"){
              let ZonaSpan = document.createElement("span")
              ZonaSpan.style.color = zonaCor
              ZonaSpan.innerText = dataToShow.Zona
              p.innerHTML = `<strong>${key}:</strong> `
              p.appendChild(ZonaSpan)

          }else{break}
        resultDiv.appendChild(p)
      }
    }

    var voltarBtn = document.createElement("button")
    voltarBtn.type = "button"
    voltarBtn.innerText = "Consultar mais"
    voltarBtn.style = "margin-top: 20px; padding: 10px 20px; background-color: #1b305a; color: #fff; border: none; border-radius: 5px; cursor: pointer;"
    resultDiv.appendChild(voltarBtn)
    voltarBtn.addEventListener("click", async function () {
      limparCookies()
      location.reload()
    })

    if (queryData.situacao === "REGULAR") {
      var addToMissao = document.createElement("button")
      addToMissao.type = "button"
      addToMissao.innerText = "Registrar Apoiamento"
      addToMissao.style = "margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer;"
      resultDiv.appendChild(addToMissao)
      addToMissao.addEventListener("click", async function () {
        const params = new URLSearchParams()
        params.append("name", queryData.nome)
        params.append("registration", queryData.titulo)
        params.append("zone", queryData.zona)
        params.append("uf", queryData.uf)
        const linkToOpen =
          "https://partidomissao.com/admin/assinaturas/criar"

        window.open(
          linkToOpen + "?" + params.toString(),
          "_blank",
        )
      })
    }
  }

  // Interceptar as requisições XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url
    return originalXHROpen.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4) {
        //console.log("Resposta interceptada:", xhr.responseText)
        let jsonResponse = null
        try {
          jsonResponse = JSON.parse(xhr.responseText)
        } catch (e) {}

        if (!jsonResponse) {
          return
        }

        if (
          jsonResponse.opcao_autenticacao !== undefined &&
          jsonResponse.opcao_autenticacao !== 5
          &&
          jsonResponse.opcao_autenticacao !== 7
          &&
          jsonResponse.opcao_autenticacao !== 11
        ) {
          location.reload()
        } else if (jsonResponse?.eleitor) {
          //console.log({ jsonResponse })
          // Preparar os dados da consulta
          const queryData = {
            nome: jsonResponse.eleitor.nomeCivil,
            titulo: jsonResponse.eleitor.inscricao,
            situacao: jsonResponse.eleitor.situacao,
            //bloqueados
            zona: jsonResponse.ondeVotara.zona,
            uf: jsonResponse.ondeVotara.uf,
            data: new Date().toISOString()
          }

          // Salvar os dados da consulta no localStorage
          let recentQueries = JSON.parse(localStorage.getItem('tse_recentQueries')) || []

          // Adicionar a nova consulta ao início da lista
          recentQueries.unshift(queryData)

          // Limitar a lista a 10 itens
          if (recentQueries.length > 100) recentQueries.pop()

          // Salvar de volta no localStorage
          localStorage.setItem('tse_recentQueries', JSON.stringify(recentQueries))

          // Exibir o resultado
          displayResult(queryData)
        }
      }
    })

    return originalXHRSend.apply(this, arguments)
  }

  


})()