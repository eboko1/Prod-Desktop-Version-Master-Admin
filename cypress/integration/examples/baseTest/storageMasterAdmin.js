/// <reference types="cypress" />
////import LoginPage from '../../support/pageObject/loginPage';

////const loginPage = new LoginPage();
const path = require("path");
const baseUrl = 'https://'+Cypress.env('url')+'my.carbook.pro';
const textServise = 'Доставка Запчастин'
var date = new Date();
const idProduct ='TEST'+date.getDate()+date.getMonth()+date.getMinutes()//+date.getSeconds();
//const idProduct ='TEST'+'5057'

const username = Cypress.env('Login')
const password = Cypress.env('Password')

describe ('Складські документи ', function(){
        beforeEach('User LogIn ',function(){
            cy.visit(baseUrl)
            cy.get('#login.ant-input').type(Cypress.env('Login'));  
            cy.get('#password').type(Cypress.env('Password'));
            cy.get('button').click()
            cy.intercept('GET', baseUrl+'/dashboard')
            cy.get('.styles-m__title---Nwr2X').contains('Календар Завантаження');
        });

    it('Створення нового Товару через картку Товару / id= '+idProduct ,function(){
        cy.get('.ant-menu-submenu-title').contains('Довідник').click()
        cy.wait(2000);
        cy.get('.ant-menu-submenu').contains('Товари').click()
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.get('#code').type(idProduct)
        cy.get('.ant-form').find('.ant-select-selection').eq(0).type('100 Plus')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').click({force: true})
        cy.wait(2000);
        cy.get('.ant-form').find('.ant-select-selection').eq(1).type('1020201')
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(1) > :nth-child(3) > .ant-select-tree-treenode-switcher-open > .ant-select-tree-child-tree > li > .ant-select-tree-node-content-wrapper').click({force: true})
        cy.get('#tradeCode').type('0000000000')
        cy.get('#certificate').type('00000000000000000')
        cy.get('.ant-form').find('button').click()   //.contains('Застосувати')
        cy.wait(2000);
        cy.get(':nth-child(1) > :nth-child(1) > div > .ant-input').first().type(idProduct)
        cy.wait(3000);
        cy.get('.ant-table-content td').first().should('exist')
        cy.wait(3000);
        cy.get('a > div').first().invoke('text')
            .then (text => {
                cy.log(text)
            expect(text).to.eq(idProduct)
        })
    })

it(' AUT / Витрати з НЗ / Створення нового Ремонту та відображення створеного дока в AUT',function(){
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.contains('Швидка навігація').click({force: true})
    cy.get('h1').should('have.text','Швидка навігація')
    cy.get(':nth-child(1) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
    cy.get('.styles-m__title---Nwr2X > span').should('have.text','Нові')
    cy.get('.styles-m__description---1eHYb > span').should('have.text','Керування Вашими замовленнями')
    cy.get('.styles-m__header---2z2EP').find('.ant-btn').contains('Додати').first().click({force: true})
    cy.wait(2000);
    cy.get('#searchClientQuery').type('Vika')
    cy.get('.ant-select > .ant-select-selection').eq(3).type('Vika')
    cy.get('.ant-select-dropdown-menu-item').last().click({force: true})
    cy.wait(2000);
    cy.get('.ant-table-row > :nth-child(1)').first().click({force: true})
    cy.get('.styles-m__header---2z2EP').find('.ant-btn').contains('Додати').first().click({force: true})
    cy.wait(2000);
    cy.get('.ant-tabs-nav').contains('Запчастини').first().click({force: true})
    cy.get('.styles-m__headerActions---29OlS > [title="Додати"]').first().click({force: true})
    cy.get('.ant-radio-group').contains('Склад').first().click({force: true})
    cy.get(':nth-child(7) > :nth-child(1) > [style="display: flex;"] > .ant-btn').first().click({force: true})
    cy.wait(1000);
    cy.get('[data-row-key="0"] > :nth-child(8) > .ant-btn').first().click({force: true})
    cy.wait(1000);
    cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
    cy.wait(1000);
    cy.get('.styles-m__dropdownTitle---3Vlog > :nth-child(2) > span').first().click({force: true}) /// перевести
    cy.wait(2000);
    cy.get('.ant-dropdown-menu-item').contains('Завершено').first().click({force: true})
    cy.wait(2000); 
    cy.get('.ant-modal').contains('OK').click({force: true})/////////////
    cy.get('.sc-bxivhb > .ant-checkbox > .ant-checkbox-inner').first().click({force: true})  ///модалка оплати ч/з Завершено
    cy.get('.ant-btn-primary').contains('Так').click({force: true})
    cy.wait(3000); 

    cy.get('.styles-m__title---Nwr2X').first().invoke('text').then(text =>{
        cy.log(text)
        const numArr = text.split('-') 
        cy.log(numArr[numArr.length-1])
        const newNmArr = numArr[numArr.length-1].split('З') 
        cy.log(newNmArr[0])
       //// cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])

        cy.get('.styles-m__logo---2zDPJ').click()  ////перехід швидка навігація
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')  
        cy.get(':nth-child(12) > .styles-m__buttonLink---1D7wr > .ant-btn').first().click({force: true})///витрати з НЗ AUT
        cy.wait(2000);
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})// вибір першого AUT в списку
        cy.get(':nth-child(5) > :nth-child(1) > div > a').first().invoke('text').then( textFind =>{
            expect('MRD-'+'4835-'+newNmArr[0]).to.eq(textFind)
        })
    })
    cy.wait(2000);
})

    it('AUT / Завантаження документа .pdf', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(12) > .styles-m__buttonLink---1D7wr > .ant-btn').first().click({force: true})///витрати з НЗ AUT
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
            cy.wait(2000)
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('AUT / Завантаження документа .xlsx', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(12) > .styles-m__buttonLink---1D7wr > .ant-btn').first().click({force: true})///витрати з НЗ AUT
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

  it(' ORD / Замовлення Постачальнику через + / Сторінка Швидка навігація ', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Замовлення постачальнику')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(2000);//
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Замовлення постачальнику').should('have.text','Коментарій Замовлення постачальнику')
        cy.get(':nth-child(3) > .ant-input').type('ORD'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('ORD / Додавання ЗЧ в Замовлення постачальнику / Модалка +', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        //////cy.get('.ant-table-row > :nth-child(1) > .ant-btn').first().click({force: true})///////////
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.wait(2000);
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input-number-input').eq(1).clear().type('100.88')
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })

   it('ORD / Відображення модалки ШК )', function() {
      cy.get('.styles-m__logo---2zDPJ').click()
      cy.contains('Швидка навігація').click({force: true})
      cy.get('h1').should('have.text','Швидка навігація')
      cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
      cy.wait(2000)
      cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
      cy.wait(2000);
      cy.get('[title="Штрих-код"] > .anticon > svg > path').first().click({force: true})///STP-4835-898989
      cy.wait(2000);
      cy.get('.styles-m__barcodeWrapp---2BTJQ > .ant-input').type('898989')
      cy.get('.ant-modal-footer > .ant-btn-primary').contains('Оновити').first().click({force: true})
      cy.wait(2000)

   })

    it('ORD / Перевід документа Замовлення постачальнику в статус Враховано ', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click() /////////
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('ORD / Завантаження документа .pdf', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('ORD / Завантаження документа .xlsx',function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })
   
    it('ORD / Відображення документа в списку Замовлення постачальнику', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
   })

it('ORD / Створення документа Замовлення Постачальнику через кнопку Додати', function() {
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.contains('Швидка навігація').click({force: true})
    cy.get('h1').should('have.text','Швидка навігація')
    cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(1) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
    cy.wait(2000)
    cy.get('.ant-btn').contains('Додати').click({force: true})
    cy.wait(2000)
    cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Замовлення постачальнику')
})

     it(' BOR / Коригування Замовлення через +', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Коригування замовлення')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Коригування Замовлення').should('have.text','Коментарій Коригування Замовлення')
        cy.get(':nth-child(3) > .ant-input').type('BOR'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(1000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })     
        
    it('BOR / Вибір коригуючого Товару з модалки Каталог. Перевід у статус Враховано', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        ///////cy.get('.ant-modal-body > .ant-select > .ant-select-selection').type('100')

        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11')
        cy.wait(2000); 
        cy.get('.ant-modal-body').find('.ant-input-number-handler-up').eq(1).dblclick()
        cy.wait(2000);
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.get('div.ant-dropdown-trigger ').click()
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
        cy.wait(2000);
    })

    it('BOR / Завантаження документа .pdf', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('BOR / Завантаження документа .xlsx', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('BOR / Відображення документа в списку Коригуючих замовлень', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
    })

    it('BOR / Створення документа Коригуючих замовлень через кнопку Додати',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(3) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Коригування замовлення') 
    })

    it(' COM / Прихід за Замовленням через +', ()=>{
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Прихід за замовленням')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(3000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Прихід за замовленням').should('have.text','Коментарій Прихід за замовленням')
        cy.get(':nth-child(3) > .ant-input').type('COM'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })     
        
    it('COM / Додавання ЗЧ в Прихід за Замовленням', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input-number-handler-up').eq(1).dblclick()
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })

    it('COM / Перевід документа Приходу за Замовленням в статус Враховано',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000)
        cy.get('div.ant-dropdown-trigger > span').click()
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('COM / Завантаження документа .pdf ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('COM / Завантаження документа .xlsx', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('COM / Відображення документа в списку Прихoди за Замовленнями',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
    })

    it('COM / Створення документа Прихoди за Замовленнями через кнопку Додати', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(2) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Прихід за замовленням')
    })
  
    it(' INC / Прихід Товару від Постачальника через + ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Прихід від постачальника')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(1000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(1000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Прихід від постачальника').should('have.text','Коментарій Прихід від постачальника')
        cy.get(':nth-child(3) > .ant-input').type('INC'+idProduct)
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(1000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(1000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(1000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
        cy.wait(2000);
    })

    it('INC / Додавання ЗЧ в Прихід від Постачальника, редагування ціни', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct)
        cy.wait(2000) 
        cy.get('.ant-modal-body').find('.ant-input-number-input').eq(1).clear().type('10.9') 
        cy.get('.ant-modal-body').find('.ant-input').last().click()
        cy.wait(1000);
        cy.get('.ant-modal-header').last().should('have.text','Вибір комірки')
        cy.wait(1000);
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true})
        cy.wait(1000);
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(1000);
    })

    it('INC / Перевід документа Приходу від Постачальника в статус Враховано ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click()
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
    })

    it('INC / Оплата Приходу від Постачальника',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.get('.styles-m__header---2z2EP').find('.anticon-dollar').should('exist').first().click({force: true})
        cy.wait(2000)
        cy.get('.ant-modal-body').should('exist')
        cy.get('.ant-modal-footer').find('.ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.styles-m__sumNumeral---KAUvr').find('span').should('have.text','0 грн.')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('INC / Відображення документа в списку Приходів на Склад ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
    })


    it('INC / Завантаження документа .pdf ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('INC / Завантаження документа .xlsx',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('INC / Створення документа Прихід від Постачальника через кнопку Додати',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(6) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Прихід від постачальника')
    })

      it(' SRV / Прихід Послуги через кнопку +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Послуги')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Прихід Послуги').should('have.text','Коментарій Прихід Послуги')
        cy.get(':nth-child(3) > .ant-input').type('SRV'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('SRV / Додавання Послуги',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Послуги')
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.get('.ant-table-row > :nth-child(1) > .ant-btn').first().click({force: true})
        cy.get('.ant-modal-body').find('.ant-input').eq(0).should('have.text','').type(textServise)
        cy.wait(2000)
        ///// cy.get('.ant-modal-body').find('.ant-input').eq(1).click()                                  // джерело
        cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').should('have.value','1,00')
        cy.get(':nth-child(5) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').should('have.value','1,00')
        cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type(222.22).should('have.value','222,22')
        cy.get(':nth-child(5) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type(2.2).should('have.value','2,2')
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })

    it('SRV / Перевід Прихід Послуги в статус Враховано',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.get('div.ant-dropdown-trigger > span').click()
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.wait(2000);
    })

    it('SRV / Оплата / Прихід Послуги ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.get('.styles-m__header---2z2EP').find('.anticon-dollar').should('exist').first().click({force: true})
        cy.get('.ant-modal-body').should('exist')
        cy.wait(2000);
        cy.get('.styles-m__buttonGroup---14_lS').find('.ant-btn').click()
        cy.get('.styles-m__sumNumeral---KAUvr').find('span').should('have.text','0 грн.')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('SRV / Завантаження документа .pdf ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('SRV / Завантаження документа .xlsx',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('SRV / Відображення документа в списку Послуг',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Послуги')
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
    })

    it('SRV / Створення документа Послуги через кнопку Додати',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(7) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(3000)
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Послуги')
        cy.wait(1000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Послуги')
    })
    
  it(' SRT / Повернення Постачальнику через +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Повернення постачальнику')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Повернення постачальнику').should('have.text','Коментарій Повернення постачальнику')
        cy.get(':nth-child(3) > .ant-input').type('SRT'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(3000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('SRT / Додавання ЗЧ в документ Повернення Постачальнику',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Повернення постачальнику')
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number-input').eq(1).clear().type('1.7') 
        cy.wait(2000);
        cy.get('.ant-modal-body').find('.ant-input').last().click()
        cy.get('.ant-modal-header').last().should('have.text','Вибір комірки')
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true})
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
    })

    it('SRT / Перевід Повернення Постачальнику в статус Враховано',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Повернення постачальнику')
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click()
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.wait(2000);
    })

    it('SRT / Завантаження документа .pdf ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('SRT / Завантаження документа .xlsx',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('SRT / Відображення документа Повернення Постачальнику у списку Витрат на Складі ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Повернення постачальнику')
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
    })
   
    it('SRT / Створення документа Повернення Постачальнику через кнопку Додати',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(2) > .styles-m__blockItems---2q9Ea > :nth-child(8) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('.styles-m__header---2z2EP').find(':nth-child(1) > .ant-btn').should('have.text','Повернення постачальнику')
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Повернення постачальнику')
    })
   
  it(' OUT / Витрати Товару / Продаж Клієнту через +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(11) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Продаж')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Vika')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Продаж Клієнту').should('have.text','Коментарій Продаж Клієнту')
        cy.get(':nth-child(3) > .ant-input').type('OUT'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('OUT / Додавання ЗЧ Продажу Клієнту через модалку Каталог', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input').eq(2).click({force: true})           ///комірка
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true}) ///комірка
        cy.wait(2000);
        cy.get('.ant-modal-body').find('.ant-input-number-input').eq(1).clear().type('1.22')
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })

    it('OUT / Оплата та Перевід в статус враховано Витрати Товару / Продаж Клієнту ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click() /////////
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get(':nth-child(1) > .ant-radio > .ant-radio-inner').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-modal-body').contains('Так').click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('OUT / Перевірка 0 Залишку Витрати Товару / Продаж Клієнту ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__sumNumeral---KAUvr').last().should('have.text','0 грн.')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('OUT / Завантаження документа .pdf ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('OUT / Завантаження документа .xlsx', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('OUT / Відображення документа в списку Витрати Товару / Продаж Клієнту / Пошук по номеру документа /  ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
   })

   it('OUT / Створення документа Витрати Товару / Продаж Клієнту через кнопку Додати',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(11) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Продаж')
    })

  it(' CRT / Прихід Товару / Повернення від Клієнта через +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get(':nth-child(1) > :nth-child(2) > .ant-select > .ant-select-selection').should('have.text','Повернення від клієнта')
        cy.get('.ant-select > .ant-select-selection').eq(3).type('Vika')
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(3).clear().type('Коментарій Повернення від клієнта').should('have.text','Коментарій Повернення від клієнта')
        cy.get(':nth-child(3) > .ant-input').type('CRT'+idProduct)
        cy.get(':nth-child(3) > :nth-child(1) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.wait(2000);
        cy.get(':nth-child(3) > :nth-child(2) > .ant-select > .ant-select-selection').click()
        cy.wait(2000);
        cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true})
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('CRT / Додавання ЗЧ через модалку Каталог / Повернення від Клієнта',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input').eq(3).click({force: true})           ///комірка
        cy.wait(2000);
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true}) ///комірка
        cy.wait(2000);
        cy.get('.ant-modal-body').find('.ant-input-number-input').eq(1).clear().type('1.22')
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })

    it('CRT / Перевід в статус враховано Прихід Товару / Повернення від клієнта ',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click() /////////
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X').contains('Врах.').should('exist')
    })

    it('CRT / Оплата / Прихід Товару / Повернення від клієнта ', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.anticon-dollar').last().click({force: true})
        cy.wait(2000);
        cy.get('.ant-modal-header').contains('Касовий ордер')
        cy.wait(2000);
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000);
    })

    it('CRT / Перевірка 0 Залишку Прихід Товару / Повернення від клієнта ', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get('.styles-m__paper---3d-H1').children().eq(1).find(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__sumNumeral---KAUvr').last().should('have.text','0 грн.')
        cy.get('.styles-m__header---2z2EP').find('.anticon-close').click()
    })

    it('CRT / Завантаження документа .pdf',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('CRT / Завантаження документа .xlsx',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })
    it('CRT / Відображення документа в списку Прихід Товару / Повернення від клієнта / Пошук по номеру документа /  ', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
   })

   it('CRT / Створення документа Прихід Товару / Повернення від клієнта через кнопку Додати',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(13) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Повернення від клієнта')
    })

  it(' STP / Плюс по Інвент. / через +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get('.ant-select > .ant-select-selection').eq(2).should('have.text','Надлишки по iнвент.')
        cy.get('.ant-input').eq(3).clear().type('Коментарій Плюс по Інвент.').should('have.text','Коментарій Плюс по Інвент.')
        cy.get(':nth-child(3) > .ant-input').type('STP'+idProduct)
        cy.wait(2000);
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('STP / Додавання ЗЧ через модалку Каталог / Плюс/Надлишки по Інвент.',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input').eq(2).click({force: true})           ///комірка
        cy.wait(2000);
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true}) ///комірка
        cy.wait(2000);
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })


    it('STP / Оплата та Перевід в статус враховано Плюс/Надлишки по Інвент.', function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click() /////////
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X').contains('Врах.').should('exist')
    })

    it('STP / Завантаження документа .pdf ',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('STP / Завантаження документа .xlsx',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('STP / Відображення документа в списку Плюс/Надлишки по Інвент. (STP)',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(1) > .ant-btn').should('have.text','Надлишки по iнвент.')
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
   })

   it('STP / Створення документа  Плюс/Надлишки по Інвент.',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(10) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Надлишки по iнвент.')
    })
  
    it(' STM / Мінус по Інвент. / через +',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__folderLink---2Myrv').click({force: true})
        cy.get('.ant-select > .ant-select-selection').eq(2).should('have.text','Недостача по iнвент.')
        cy.get('.ant-input').eq(3).clear().type('Коментарій Мінус по Інвент.').should('have.text','Коментарій Мінус по Інвент.')
        cy.get(':nth-child(3) > .ant-input').type('STM'+idProduct)
        cy.wait(2000);
        cy.get('.ant-badge > .anticon').last().click({force: true}) // дискетка 
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X > :nth-child(1) > span').should('have.text','Нов.')
    })

    it('STM / Додавання ЗЧ через модалку Каталог Мінус/Недостача по Інвент.',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('.styles-m__headerActions---2KdHm > :nth-child(2)').first().click({force: true})
        cy.wait(2000);
        cy.get('.ant-input').eq(0).should('have.text','')
        cy.get('.ant-modal-body').find('.ant-input').first().type(idProduct) 
        cy.get('.ant-modal-body').find('.ant-input-number').first().type('111.11') 
        cy.get('.ant-modal-body').find('.ant-input').eq(2).click({force: true})           ///комірка
        cy.wait(2000);
        cy.get('[data-row-key] > :nth-child(8) > .ant-btn').first().click({force: true}) ///комірка
        cy.wait(2000);
        cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
        cy.wait(2000);
    })


    it('STM / Оплата та Перевід в статус враховано Мінус/Недостача по Інвент.',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
        cy.wait(2000);
        cy.get('div.ant-dropdown-trigger > span').click() /////////
        cy.wait(2000);
        cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
        cy.wait(2000);
        cy.get('.styles-m__title---Nwr2X').contains('Врах.').should('exist')
    })

    it('STM /  Завантаження документа .pdf ', function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('Документ').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'document-'+text+'.pdf')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('STM / Завантаження документа .xlsx',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            cy.get('[data-row-key] > :nth-child(1) > a').first().click({force: true})
            cy.get('.anticon-printer > svg').first().click({force: true})
            cy.get('.ant-dropdown-menu-item').contains('XLSX').click({force: true});
           
            if(cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")){
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            } else{
                cy.wait(10000)
                cy.readFile(path.join('cypress/downloads', 'Store document report for '+numArr[numArr.length-1]+'.xlsx')).should("exist")
            }
          
            cy.log('document-'+text+'.pdf')
            })
        })
    })

    it('STM / Відображення документа в списку Мінус/Недостача по Інвент.(STM)',  function() {
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(1) > .ant-btn').should('have.text','Недостача по iнвент.')
        cy.get('[data-row-key] > :nth-child(1) > a').first().invoke('text').then(text =>{
            cy.log(text)
            const numArr = text.split('-') 
            cy.get('.styles-m__paper---3d-H1').find('.ant-input').type(numArr[numArr.length-1])
            cy.get('.ant-table-row > :nth-child(1) > a').first().invoke('text').then( textFind =>{
                expect(text).to.eq(textFind)
            })
        })
   })

   it('STM / Створення документа Мінус/Недостача по Інвент.(STM)',  function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.contains('Швидка навігація').click({force: true})
        cy.get('h1').should('have.text','Швидка навігація')
        cy.get(':nth-child(15) > .styles-m__buttonLink---1D7wr > .ant-btn').click({force: true})
        cy.wait(2000)
        cy.get('.ant-btn').contains('Додати').click({force: true})
        cy.wait(2000)
        cy.get(':nth-child(2) > .ant-select > .ant-select-selection > .ant-select-selection__rendered > .ant-select-selection-selected-value > span').should('have.text','Недостача по iнвент.')
    })

})
