/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const TICK = 3000

    beforeEach(() => {
        cy.visit('./src/index.html');
    })
    it('verifica o título da aplicação', function () {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche campos obrigatórios e envia formulário', () => {
        cy.clock()

        cy.get('#firstName').type('paulo')
        cy.get('#lastName').type('costa')
        cy.get('#email').type("paulo@teste.com")
        cy.get('#open-text-area').type('teste')

        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(TICK)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao enviar form', () => {
        cy.clock()

        cy.get('#firstName').type('paulo')
        cy.get('#lastName').type('costa')
        cy.get('#email').type("paulo@teste,com")
        cy.get('#open-text-area').type('teste')

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(TICK)

        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio quando digitado diferente de numérico', () => {
        cy.get('#phone').type('aajnjnjvbvjfbvjbdvj').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        const longText = 'teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste teste '
        cy.get('#firstName').type('paulo')
        cy.get('#lastName').type('costa')
        cy.get('#email').type("paulo@teste.com")
        cy.get('#open-text-area').type(longText, {
            delay: 0
        })

        cy.get('#phone-checkbox').check()

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(TICK)
        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName')
            .type('paulo')
            .should('have.value', 'paulo')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()


        cy.get('.error').should('be.visible')

        cy.tick(TICK)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(TICK)

        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu valor (value)', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    })


    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type=radio][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type=radio]')
            .should('have.length', 3)
            .each((radio) => {
                cy.wrap(radio).check()
                cy.wrap(radio).should('be.checked')
            })
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]').check().last().uncheck().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should((input) => {
                expect(input[0].files[0].name).equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should((input) => {
                expect(input[0].files[0].name).equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')

        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@sampleFile')
            .should((input) => {
                expect(input[0].files[0].name).equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should((res) => {
                const { status, statusText, body } = res
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
    })

    it('encontra o gato escondido', () => {
        cy.get("#cat")
            .invoke('show')
            .should('be.visible')
    })
})