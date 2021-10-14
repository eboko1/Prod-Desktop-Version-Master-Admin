/// <reference types="cypress" />

const url = ''   


const baseUrl = 'https://'+url+'my.carbook.pro';
const appointments = 'https://'+url+'my.carbook.pro/orders/appointments';
const approve = 'https://'+url+'my.carbook.pro/orders/approve';
const progress = 'https://'+url+'my.carbook.pro/orders/progress';
const success = 'https://'+url+'my.carbook.pro/orders/success';
const cancel = 'https://'+url+'my.carbook.pro/orders/cancel';


var date = new Date();
const idClient =''+date.getDate()+date.getMonth()+date.getMinutes();
var second = parseInt(date.getSeconds())+10
var minute = parseInt(date.getMinutes())+10
var codeNZ =''

//const idClient ='7947'


describe ('Prod|Desktop|UA|CarBook', function(){
  beforeEach('User LogIn ', () => {
    cy.visit(baseUrl)
    cy.get('#login.ant-input').type(Cypress.env('ProdLogin'));  
    cy.get('#password').type(Cypress.env('Password'));
    cy.get('button').click()
    cy.intercept('GET', baseUrl+'/dashboard')
    cy.get('.styles-m__title---Nwr2X').contains('Календар Завантаження');
  });

  it('1.Профіль вибір українського інтерфейсу', function(){
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.get('.styles-m__userName---h3mg1').click()
    .then (()=>{
      cy.get('#language').click()
      cy.contains('Українська').click();
      cy.wait(1000)
    })
    .then (()=>{
        cy.get('.ant-btn').first().click({force: true});
    })
 })

    it('2.+Клієнта та а/м: '+idClient, function(){
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.wait(1000)
        cy.contains('Ремонти').click({force: true})
        .then(()=>{
            cy.log('Вибір Меню ремонти');
            cy.get('a > .ant-btn').click(); // add н/з
        })
        .then(()=>{
            cy.wait(3000)
            cy.log('Додати клієнта через +');
            cy.get('.anticon-plus > svg').click()

        })
        .then(()=>{
            cy.log('Модалка Додати Клієнта')
            cy.get('#name').type('БазовийКлієнт' + idClient)
            cy.get('#patronymic').type('По батькові')
            cy.get('#surname').type('Прізвище')
            .then(()=>{
                cy.get('#sex').click();
                cy.contains('Чоловіча').click();
            })
            .then(()=>{
                cy.get('#status').click();
                cy.contains('Преміум').click();
            })
            .then(()=>{
                cy.log('Дата народження клієнта ');
                cy.get('#birthday').click();
                cy.contains('10').click();
            })
            .then(()=>{
                cy.get('#source').click();
                cy.contains('CarBook').click()
            })
            .then(()=>{
                cy.get('#paymentRespite').first().type('5');

            })
            .then(()=>{
                cy.log('Номер телефону клієнта');
                cy.get('.ant-input-number-input').eq(2).type(second+'0'+minute+''+second+''+minute)
            })
            .then(()=>{
                cy.log('Додавання АВТО');
                cy.get('.styles-m__addVehicleButtonCont---Y1h26 > .ant-btn').first().click({ force: true }) //{ force: true }
            })
            .then(()=>{
                cy.log('Додавання Держ.номера а/м');
                cy.get('#vehicle_add_from_number').clear().type('АО6028ВО')
            })
            .then(()=>{
                cy.log('VIN авто');
                cy.get('#vehicle_add_from_vin').type('MDHFBUK13U0107589');
                cy.wait(2000)
            })
            .then(()=>{
                cy.log('Рік авто');
                cy.get(':nth-child(3) > .ant-col-12').click().type('Чорний')
                cy.wait(2000)
                cy.get('.ant-select-dropdown-menu-item-active').click()
                cy.wait(2000)
            })
            .then(()=>{
                cy.log('Рік авто');
                cy.get(':nth-child(4) > .ant-col-12').click().type('2014')
                cy.wait(2000)
                cy.get('.ant-select-dropdown-menu-item-active').click()
                cy.wait(2000)
            })
            .then(()=>{
                cy.log('Марка авто')
                cy.get(':nth-child(5) > .ant-col-12').click().type('NISSAN')
                cy.wait(2000)
                cy.get('.ant-select-dropdown-menu-item-active').click()
                cy.wait(2000)
            })
            .then(()=>{
                cy.log('Модель авто');
                cy.get(':nth-child(6) > .ant-col-12').click().type('MICRA')
                cy.wait(2000)
                cy.get('.ant-select-dropdown-menu-item-active').click()
                cy.wait(2000)

            })
            .then(()=>{
                cy.log('Модифікація авто');
                cy.get(':nth-child(7) > .ant-col-12').click().type('1.4 16V')
                cy.wait(2000)
                cy.get('.ant-select-dropdown-menu-item-active').click()
            })
            .then(()=>{
                cy.wait(2000)
                cy.log('Кнопка ОК');
                cy.get('.ant-btn-primary').eq(5).click()  // first()      .first().click({ force: true })
            })
        })
        .then(()=>{
            cy.log('АВТО ДОДАНО');
            cy.wait(3000)
        })
        .then(()=>{
           cy.get('.ant-btn-primary').eq(4).click();
           cy.get('.ant-btn-primary').contains('Додати').click({force: true} )
           cy.wait(3000)
        })
       // cy.pause()
    });

  it('3.Редагування мобільного номера для клієнта:'+idClient, function(){
    cy.get(':nth-child(2) > .ant-menu-submenu-title').click()
    cy.contains('Клієнти').click()
      .then(()=>{
          cy.wait(5000)
          cy.log('Пошук клієнта');
          cy.get('.ant-input').last().type('БазовийКлієнт'+idClient)  //
          cy.wait(5000)

      })
      .then(()=>{
        cy.get('.styles-m__clientLink---1JZdU').first().click()
        cy.wait(2000)
      })
      .then(()=>{
        cy.get('.ant-input-number-input').eq(1).focus().clear('0').type('0683781977')
        cy.wait(2000)
      })
      .then(()=>{
        cy.get('.ant-modal-confirm-title').should('exist');
        cy.get('.ant-modal-confirm-btns > .ant-btn').click()
        cy.wait(2000)
        cy.get('.styles-m__editClientForm---2hdWi > .ant-btn').click()
      })
      .then(()=>{
        cy.wait(5000)
      })
    })

    it('4.Додати Н/З, підтягування клієнта через пошук, клієнт: '+idClient, function(){
        cy.contains('Ремонти').click()
          .then(()=>{
              cy.log('Вибір Меню ремонти');
              cy.get('a > .ant-btn').click(); // add н/з
          })
          .then(()=>{
            cy.wait(3000)
            cy.get('#searchClientQuery').clear().type('Клієнт'+idClient)
          })
          .then(()=>{
              cy.get('.styles-m__clientBlock---1yPc8 > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(1)').first().click();
            })
          .then(()=>{
            cy.get('.ant-btn').first().click();
          })
          .then(()=>{
            cy.wait(7000)
            cy.log('Ремонт ДОДАНО');
          })
    });

  it('5.Редагування н/з та додавання Поста, Механіка, Готівки, Реквізити STO, Пробіг', function(){
      cy.log('Вибір Меню ремонти');
      cy.contains('Ремонти').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)
            cy.wait(2000);
            cy.get('.styles-m__ordernLink---T-qWz').first().click({ force: true });//Нові н/з
        })
        .then(()=>{
            cy.log('Відкриття модалки Планувальника');
            cy.get('.ant-form-item-required > span > .anticon ').first().click({ force: true })
            cy.wait(2000);
            cy.get('.timeColumn > :nth-child(2)').should('exist')
            /////Вибір поста
            ////cy.get(':nth-child(1) > .sc-jtRfpW > .sc-gxMtzJ > :nth-child(9)').trigger('mousedown')
            ////cy.get(':nth-child(1) > .sc-jtRfpW > .sc-kTUwUJ > :nth-child(9) > .sc-gGBfsJ').click()
            ////cy.get(':nth-child(1) > .sc-jtRfpW > .sc-gxMtzJ > :nth-child(9)').invoke('show').click()
            cy.wait(2000);
            cy.log('Закриття модалки Планувальника');
            cy.get('.ant-modal-close').last().click({ force: true })
            cy.wait(2000);
            cy.log('Вибір Механіка');
            cy.get('#employee').type('Механік').first().click({ force: true })
            cy.wait(1000);
            ///////cy.get('.ant-select-dropdown-menu-item-active').click();
        })
        .then(()=>{
            cy.log('Вибір Готівка');
            cy.get('#paymentMethod').click();
        })
        .then(()=>{
            cy.get('.ant-select-dropdown-menu-item-active').click();
            cy.log('Вибір Реквізити');
            cy.get ('#requisite').click();
        })
        .then(()=>{
            cy.get('.ant-select-dropdown-menu-item-active').click();
            cy.wait(1000);
            cy.log('Вибір Запчастист');
            cy.get ('#appurtenanciesResponsible').type('Запчастист').first().click({ force: true })
           ///// cy.get('.ant-select-dropdown-menu-item-active')
            cy.wait(1000);
            cy.get('#odometerValue').clear().type('123456')
        })
        .then(()=>{
            cy.get('.styles-m__headerContorls---2pU_V > .anticon-save').click() // зберегти картку
        })
        .then(()=>{
            cy.log('Процес Збереження н/з ');
            cy.wait(3000);
        })
  });

  it('6.Вибір Локації', function(){
      cy.log('Вибір Меню ремонти');
      cy.contains('Ремонти').click();// select menu remont
      cy.wait(3000);
      cy.get('.ant-input-search > .ant-input').type(idClient)
      cy.wait(2000);
      cy.get('.styles-m__ordernLink---T-qWz').first().click({ force: true });
      cy.wait(5000);
      cy.get('.styles-m__modalWrap---3KcUv > .anticon').click();
      cy.wait(1000);
      cy.log('Вибір Локації з Н/З');
      cy.wait(2000);
      cy.get('.styles-m__locationWrapper---eCnDV > .ant-select > .ant-select-selection> :nth-child(2)').first().click({ force: true });
      cy.wait(3000);
      cy.get('.styles-m__modalButton---zblVE > .ant-btn').click();// кнопка Прийняти модалка Прийняття авто на СТО
      cy.log('Завантаження АКТУ прийому передачі');
      cy.wait(5000);
  });

    it('7.Перевірка Інфо по автомобілю ', function(){
        cy.visit(appointments);
        cy.get('.styles-m__logo---2zDPJ').click()
        cy.wait(3000);
        cy.get('.ant-input-search > .ant-input').type(idClient)
        cy.wait(2000);
        cy.log('Вибір Н/З');
        cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
        cy.wait(4000);
        cy.get('[title="Інфо по автомобілю"] > .anticon > svg').click()
        cy.wait(5000);
        cy.get('.styles-m__tableHeader---1i3oL').should('exist')
        cy.get('.styles-m__tableHeader---1i3oL').contains('Спецификации масел и технических жидкостей')
    });

  it('8.Перевід у статус Запис', function(){
      cy.log('Вибір Меню ремонти'+ cy.url());
      cy.contains('Ремонти').first().click({ force: true })
        .then(()=>{
         // cy.get('.styles-m__ordernLink---T-qWz').invoke('attr', 'href').then( href => {cy.visit(baseUrl+href); });
         cy.get('.ant-input-search > .ant-input').type(idClient)
         cy.wait(2000);
         cy.get('.styles-m__ordernLink---T-qWz').first().click({ force: true });
         cy.url().should('include', '/order/')
        })
        .then(()=>{
         cy.wait(5000);
         cy.get('.styles-m__dropdownTitle---3Vlog > :nth-child(2) > span').click(); // Статус Запис
        })
        .then(()=>{
            cy.get('.ant-dropdown-menu-item').contains('Запис').click()
            cy.log('Перевести н/з в статус Запис');
            cy.wait(3000);
        })
        .then(()=>{
            cy.get('.styles-m__headerContorls---2pU_V > .anticon-save').click() // зберегти картку
        })
        .then(()=>{
            cy.wait(3000);
            cy.log('Процес Збереження н/з ');
        })
        .then(()=>{
            cy.get('.anticon-close').first().click({ force: true }); // закрити картку
        })
        .then(()=>{
            cy.wait(2000);
        })
  });

  it('9.Створення Діагностики', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Запису');
        })
        .then(()=>{
            cy.wait(2000)
            cy.log('Перехід до діагностики');
            cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(2)').click(); //клік на вкладку діагностики
        })
        .then(()=>{
            cy.log('Клік на випливаюче меню');
            cy.get('.styles-m__diagnosticTableHeader---1_8Bu > :nth-child(2) > .ant-select > .ant-select-selection').click();
        })
        .then(()=>{
            cy.log('Вибір діагностики');
            cy.get('.ant-select-dropdown-menu > :nth-child(2)').click();
        })
        .then(()=>{
            cy.log('Клік на +');
            cy.get('.styles-m__diagnosticTableHeader---1_8Bu > :nth-child(3) > :nth-child(1)').click();
            cy.wait(2000)
        })
        .then(()=>{
            cy.log('Клік на  all checkbox');
            cy.get('[style="width: 5%; padding: 5px 15px;"] > .ant-checkbox-wrapper > .ant-checkbox > .ant-checkbox-input').click();
            cy.wait(2000)
        })
        .then(()=>{
            cy.log('Клік на all OK ');
            cy.get('.styles-m__diagnosticTableHeader---1_8Bu > .styles-m__diagnostic_status_button_wrap---ucmHY > [title="Вузол / все гаразд"]').click();
            cy.wait(5000)
        })
        .then(()=>{
            cy.log('Клік на Редагувати');
            cy.get('[data-row-key="1"] > :nth-child(7) > .styles-m__diagnostic_status_button_wrap---ucmHY > .ant-btn').first().click({force: true});;//редагувати
            cy.wait(2000)
        })
        .then(()=>{
            cy.log('Клік на Критично!');
            cy.get('[data-row-key="1"] > :nth-child(7) > .styles-m__diagnostic_status_button_wrap---ucmHY > .ant-btn-danger').first().click({force: true});
            cy.wait(3000)
        })
        .then(()=>{
            cy.get('[data-row-key="1"] > :nth-child(5) > div > .ant-btn').click(); // click message icon
            cy.wait(2000)
        })
        .then(()=>{
            cy.log('модалка Додати коментар!');
            cy.get(':nth-child(1) > .styles-m__blockButtonsWrap---1vfJT > :nth-child(3)').click(); // Що?
            cy.get(':nth-child(2) > .styles-m__blockButtonsWrap---1vfJT > :nth-child(1)').click(); //Де?
            cy.get('.ant-modal-footer > .ant-btn-primary').click();//зберегти модалка Додати коментар
        })
        .then(()=>{
            cy.log('Створити калькуляцію');
            cy.get('[style="width: 35%; margin-right: 5px;"]').click();//кнопка Створити калькуляцію
        })
        .then(()=>{
            cy.get('.styles-m__confirm_diagnostic_modal_row_button---36VYf > [title="Створити роботи і з/ч автоматично"]').click();
            cy.wait(3000)
        })
        .then(()=>{
            cy.log('Звершити діагностику');
            cy.get('button').contains('Завершити діагностику').click({force: true});
        })
        .then(()=>{
           //// cy.get('.anticon-save').click() // зберегти картку
        })
        .then(()=>{
            cy.log('Процес Збереження н/з ');
            cy.wait(2000)
        })
  });

  it('10.Редагування ціни для доданої Роботи з діагностики', function(){
    cy.visit(approve);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Запису');
    cy.wait(4000);
    cy.log('Вкладка Роботи');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
    cy.wait(1000);
    cy.get(':nth-child(1) > [title="Швидке редагування"] > div').first().click({force: true})
    cy.wait(1000);
    cy.log('Закупочна ціна');
    cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('111');
    cy.wait(1000);
    cy.get('.ant-btn-primary').last().click({force: true})
    cy.wait(1000);
    cy.log('Встановлення знижки на роботи');
    cy.get('#servicesDiscount').clear().type('20');
    cy.wait(2000);
    cy.get('.styles-m__servicesMarkup---3myJY > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('120');
    cy.wait(1000);
    cy.get('.styles-m__headerContorls---2pU_V > .anticon-save').click() // зберегти картку
    cy.log('Процес Збереження н/з ');
    cy.wait(5000);
  });

  it('11.Додавання Робіт через групи Товарів', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Запису');
        })
        .then(()=>{
            cy.log('Вкладка Роботи');
            cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
            cy.wait(2000)
        })
        .then(()=>{
            cy.get('.styles-m__headerActions---2S-7g > [title="Додати"]').click()
        })
        .then(()=>{
            cy.get('.styles-m__modalSectionTitle---3iMcZ > div > span').contains('Робота')
            cy.wait(1000)
        })
        .then(()=>{
            cy.get('.ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(2) > .ant-select > .ant-select-selection').click();
            cy.wait(1000)
        })
        .then(()=>{
            cy.get('.ant-select-dropdown-search > .ant-select-search__field__wrap > .ant-select-search__field').type('Фільтри повітряні')
            cy.get('.ant-select-tree-child-tree-open').eq(1).click()
        })
        .then(()=>{
            cy.get('.ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(4) > .ant-select > .ant-select-selection').click()
            cy.get('.ant-select-dropdown-menu-item-active').click();
            cy.wait(1000)
        })
        .then(()=>{
            cy.get(':nth-child(8) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('222')
            cy.wait(1000)
            cy.get(':nth-child(10) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('2')
            //додати механіка
        })
        .then(()=>{
            cy.wait(3000);
            cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
            cy.wait(2000);
        })
  })

  it('12.Додавання Робіт через поле Робіт', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Запису');
        })
        .then(()=>{
            cy.log('Вкладка Роботи');
            cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
            cy.wait(2000)
        })
        .then(()=>{
            cy.get('.styles-m__headerActions---2S-7g > [title="Додати"]').click()
        })
        .then(()=>{
            cy.get('.ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(4) > .ant-select > .ant-select-selection').type('Заміна')
            cy.wait(4000)
            cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true});
        })
        .then(()=>{
            cy.wait(3000);
            cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
            cy.wait(2000);
        })
    })

    it('12.1 Додавання Робіт повторно', function(){
        cy.visit(approve)
        cy.get('.styles-m__logo---2zDPJ').click()
            .then(()=>{
                cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
                cy.wait(2000);
                cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
                cy.log('Вибір Запису');
            })
            .then(()=>{
                cy.log('Вкладка Роботи');
                cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
                cy.wait(2000)
            })
            .then(()=>{
                cy.get('.styles-m__headerActions---2S-7g > [title="Додати"]').click()
            })
            .then(()=>{
                cy.get('.ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(4) > .ant-select > .ant-select-selection').type('Діагностика')
                cy.wait(4000)
                cy.get('.ant-select-dropdown-menu-item-active').first().click({force: true});
            })
            .then(()=>{
                cy.wait(3000);
                cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
                cy.wait(2000);
            })
        })

it('13.Вкладка Роботи > Додавання Роботи ч/з Комплекси', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
    .then(()=>{
        cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
        cy.wait(2000);
        cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
        cy.log('Вибір Запису');
    })
    .then(()=>{
        cy.log('Вкладка Роботи');
        cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
        cy.wait(2000)
    })
    .then(()=>{
        cy.log('Відкриття модалки Комплекси');
        cy.get('.styles-m__ownIcon---2tsV5').click()
        cy.wait(2000)
        cy.get('.styles-m__laborsList---3qgUM > .styles-m__listRow---2lt3h > .styles-m__nameField---3rhCH > .ant-select > .ant-select-selection').click()
        cy.wait(2000)
        cy.get('.ant-select-dropdown-menu-item-active').click()
        cy.wait(2000)
        cy.get('.ant-btn-primary').last().click({force: true})
    })
  });

    it('14.Відображення механіка в табці Роботи  ', function(){
        cy.visit(approve)
        cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Запису');
        })
        .then(()=>{
            cy.log('Вкладка Роботи');
            cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
            cy.wait(2000)
        })
        .then(()=>{
            cy.log('Механік // робота з Діагностики');
            cy.get('[data-row-key="0"] > :nth-child(6) > .ant-select > .ant-select-selection').contains('Механік').should('exist')
            cy.wait(1000)
            cy.log('Механік // + з модалки Робота');
            cy.get('[data-row-key="1"] > :nth-child(6) > .ant-select > .ant-select-selection').contains('Механік').should('exist')
            cy.wait(1000)
            cy.get('[data-row-key="2"] > :nth-child(6) > .ant-select > .ant-select-selection').contains('Механік').should('exist')
            cy.wait(1000)
            cy.log('Механік // + роботи з модалки Комплекси');
            cy.get('[data-row-key="3"] > :nth-child(6) > .ant-select > .ant-select-selection').contains('Механік').should('exist')

        })
    })

    it('15.Додавання Запчастин ч/з Групу ЗЧ', function(){
        cy.visit(approve)
        cy.get('.styles-m__logo---2zDPJ').click()
            .then(()=>{
                cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
                cy.wait(2000);
                cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
                cy.log('Вибір Запису');
            })
            .then(()=>{
                cy.log('Вкладка Запчастин');
                cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click()
            })
            .then(()=>{
                cy.get('#detailsDiscount').clear().type('15')
            })
            .then(()=>{
                cy.get('[style="width: min-content;"] > :nth-child(1) > [title="Додати"]').click()
            })

            .then(()=>{
               cy.get('.ant-table-content > .ant-table-body > table > .ant-table-tbody > .ant-table-row > :nth-child(2) > .ant-select > .ant-select-selection').click()
            })
            .then(()=>{
                cy.get('.ant-select-dropdown-search > .ant-select-search__field__wrap > .ant-select-search__field').type('Мастила (оливи) моторні')
                cy.get('.ant-select-tree-child-tree-open').eq(1).click()
            })
            .then(()=>{
                cy.get(':nth-child(10) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('333')
                cy.get(':nth-child(11) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('350')
            })
            .then(()=>{
                cy.wait(3000);
                cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true})
                cy.wait(2000);
            })
        })

  it('16.Вкладка Запчастини > Пряме редагування', function(){
    cy.visit(approve);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Запису');
    cy.wait(10000);
    cy.log('Вкладка Запчастини');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
    cy.wait(2000);
    cy.log('Пряме редагування');
    cy.get('[style="width: min-content;"] > :nth-child(1) > [title="Додати"]').click()
    cy.wait(1000);
    cy.get('.ant-radio-group > :nth-child(2)').click(); //радіо кнопка
    cy.wait(1000);
    cy.get('.ant-table-row > :nth-child(4) > .ant-input').clear().type('генератор')
    cy.wait(3000);
    cy.log('Вибір Постачальника');
    cy.get('[style="display: flex;"] > .ant-select > .ant-select-selection').click();
    cy.wait(1000);
    cy.get('.ant-select-dropdown-menu-item').contains('Exist').click();//вибір постачальника з випливаючого списка
    cy.wait(3000);
    cy.get(':nth-child(10) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('400');
    cy.wait(1000);
    cy.get(':nth-child(11) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('600');
    cy.wait(1000);
    cy.get(':nth-child(12) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear();
    cy.wait(1000);
    cy.get(':nth-child(12) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').type('3');
    cy.wait(2000);
    cy.get('.ant-btn-primary').last().click({force: true});//ОК;
    cy.wait(3000);
  });

  it('17.Вкладка Запчастини > Додавання ЗЧ по VIN', function(){
    cy.visit(approve);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вкладка Запчастини');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
    cy.wait(2000);
    cy.log('Модалка Деталь');
    cy.get('[style="width: min-content;"] > :nth-child(1) > [title="Додати"]').click()
    cy.wait(2000);
    cy.log('Вибір VIN');
    cy.get('.ant-table-row > :nth-child(3) > .ant-btn').click();
    cy.wait(5000);
    cy.get('[style="display: flex; justify-content: space-between; margin: -16px 0px 8px;"] > .ant-radio-group > :nth-child(2)').click();
    cy.wait(1000);
    cy.get('.styles-m__categoryList---3A9pG').should('exist')
    cy.wait(1000);
    cy.get('[style="display: flex; justify-content: space-between; margin: -16px 0px 8px;"] > .ant-radio-group > :nth-child(1)').click()
    cy.get('.styles-m__previewBLock---q-AEd > :nth-child(1) > img').click()
    cy.wait(1000);
    cy.get('.styles-m__listWrap---2EuIo > .ant-table-wrapper > .ant-spin-nested-loading > .ant-spin-container > .ant-table > .ant-table-content > .ant-table-body > table > .ant-table-tbody > [data-row-key="0"] > :nth-child(1)').click()
    cy.wait(1000);
    cy.get('[style="display: flex; justify-content: flex-end; margin: -16px 0px 8px;"] > .ant-btn-primary').click()
    cy.wait(2000);
    cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
    cy.wait(3000);
  });

it('18. Вкладка Запчастини > Додавання ЗЧ через ІНФО по автомобілю', function(){
  cy.visit(approve);
  cy.get('.styles-m__logo---2zDPJ').click()
  cy.wait(3000);
  cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
  cy.wait(2000);
  cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
  cy.log('Вибір Запису');
  cy.wait(10000);
  cy.log('Вкладка Запчастини');
  cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
  cy.wait(1000);
  cy.get('[title="Інфо по автомобілю"] > .anticon').click()
  cy.wait(2000);
  cy.get('[data-row-key="0"] > :nth-child(6) > .ant-btn').first().click({force: true})
  cy.wait(3000);
  cy.get('[data-row-key="0"] > :nth-child(10) > .ant-btn').first().click({force: true})
  cy.wait(2000);
  cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
  cy.wait(3000);
});

it('19. Вкладка Запчастини > Швидке редагування запчастин', function(){
  cy.visit(approve);
  cy.get('.styles-m__logo---2zDPJ').click()
  cy.wait(3000);
  cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
  cy.wait(2000);
  cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
  cy.log('Вибір Запису');
  cy.wait(10000);
  cy.log('Вкладка Запчастини');
  cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
  cy.wait(1000);
  cy.log('Швидке редагування запчастин');
  cy.get(':nth-child(4) > .ant-btn > div').first().click({force: true});
  cy.log('Вибір Запису');
  cy.wait(1000);
  cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('111');
  cy.wait(1000);
  cy.get(':nth-child(5) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('222');
  cy.wait(1000);
  cy.get(':nth-child(6) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('2');
  cy.wait(2000);
  cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
  cy.wait(3000);
  cy.get('.styles-m__headerContorls---2pU_V > .anticon-save').click() // зберегти картку
  cy.log('Процес Збереження н/з ');
  cy.wait(5000);
});

it('20. Додавання Товару через модалку Товару', function(){
    cy.get('.ant-menu-submenu-title').contains('Довідник').click()
    cy.wait(2000);
    cy.get('.ant-menu-submenu').contains('Довідники та налаштування').click()
    cy.get('button').contains('Товари').last().click({force: true})
    cy.get('.ant-btn').click()
    cy.get('#code').type(idClient+'X')
    cy.get(':nth-child(3) > .ant-col-15 > .ant-form-item-control > .ant-form-item-children > .ant-select > .ant-select-selection').type('100 Plus')
    cy.wait(2000);
    cy.get('.ant-select-dropdown-menu-item').click({force: true})
    cy.wait(2000);
    cy.get(':nth-child(4) > .ant-col-15 > .ant-form-item-control > .ant-form-item-children > .ant-select > .ant-select-selection').type('1020201')
    cy.wait(2000);
    cy.get(':nth-child(3) > :nth-child(1) > :nth-child(3) > .ant-select-tree-treenode-switcher-open > .ant-select-tree-child-tree > li > .ant-select-tree-node-content-wrapper').click({force: true})
    cy.get('#tradeCode').type('0000000000')
    cy.get('#certificate').type('00000000000000000')
    cy.get('.ant-form').find('button').click()   //.contains('Застосувати')
    cy.wait(2000);
    cy.get(':nth-child(1) > :nth-child(1) > div > .ant-input').type(idClient+'X')
    cy.wait(3000);
    cy.get('.ant-table-content td').first().should('exist')
  });

it('21. Додавання нового Товару з НЗ в Довідник Товарів', function(){
    cy.visit(approve);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вкладка Запчастини');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
    cy.wait(2000);
    cy.get('[style="width: min-content;"] > :nth-child(1) > [title="Додати"]').click()
    cy.get('.ant-radio-group > :nth-child(2)').click()
    cy.get('.ant-table-row > :nth-child(4) > .ant-input').type(idClient+'X')
    cy.get(':nth-child(7) > :nth-child(1) > .ant-input-affix-wrapper > .ant-input').type(idClient+'X')
    cy.wait(2000);
    cy.get('.styles-m__brandColumn---3m8NH > .ant-select > .ant-select-selection').type('Vika')
    cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
    cy.wait(2000);
    cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
    cy.wait(3000);
});

  it('22. Прихід від Постачальника', function(){
    cy.get('.ant-menu-submenu-title').contains('Склад').click()
    cy.wait(2000);
    cy.get('.ant-menu-submenu').contains('Приходи на склад').click()
    cy.get('button').contains('Додати').last().click({force: true})
    cy.wait(2000);
    cy.get('.ant-select > .ant-select-selection').eq(3).type('Exist')
    cy.wait(2000);
    cy.get('.ant-select-dropdown-menu-item').first().click({force: true})
    cy.wait(2000);
    cy.get('.ant-badge > .anticon').last().click({force: true})
    cy.wait(5000);
    cy.get('.styles-m__header---2z2EP').contains('Нов.').should('exist')
   // Підтягування Товару 1.2
    cy.get('.ant-table-row > :nth-child(1) > .ant-btn').first().click({force: true})
    cy.wait(2000);
    cy.get('.ant-modal-body').find('.ant-btn').click()
    cy.wait(2000);
    cy.log('Додавання коду Товару створеного в 1.1');
    cy.get('.ant-input-affix-wrapper > .ant-input').last().type(idClient+'X')
    cy.wait(2000);
    cy.get('button').contains('Вибрати').first().click({force: true})
    cy.get(':nth-child(6) > .ant-input').click()
    cy.wait(2000);
    cy.get(':nth-child(8) > .ant-btn').first().click({force: true})
    cy.wait(2000);
    cy.get(':nth-child(7) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('11.75')
    cy.wait(2000);
    cy.get(':nth-child(8) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('10')
    cy.wait(2000);
    cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
    cy.wait(2000);
    // Підтягування Товару 1.1
    cy.get('.ant-table-row > :nth-child(1) > .ant-btn').last().click({force: true})
    cy.wait(2000);
    cy.get('.ant-modal-body').find('.ant-btn').click()
    cy.wait(2000);
    cy.log('Додавання коду Товару створеного в 1.1');
    cy.get('.ant-input-affix-wrapper > .ant-input').last().type(idClient+'X')
    cy.get('button').contains('Вибрати').first().click({force: true})
    cy.wait(2000);
    cy.get(':nth-child(7) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('11.75')
    cy.wait(2000);
    cy.get(':nth-child(8) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('10')
    cy.wait(2000);
    cy.get('.ant-modal-footer > div > .ant-btn-primary').first().click({force: true})
    cy.wait(2000);
    cy.get('div.ant-dropdown-trigger > span').click()
    cy.wait(2000);
    cy.get('.ant-dropdown-menu-item').contains('Врах.').click()
    cy.wait(2000);
    cy.get('.styles-m__header---2z2EP').contains('Врах.').should('exist')
  });

//   it('23. Повернення Постачальнику', function(){
//     cy.get('.ant-menu-submenu-title').contains('Склад').click()
//     cy.wait(2000);
//   });

  it('24.Узгодження замовлення', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Н/З');
            cy.wait(5000);
        })
        .then(()=>{
            cy.get('#У > .styles-m__mapChildsBlock---1oGYD > :nth-child(1) > .ant-btn').click();
            cy.wait(5000);
            cy.log('Очікування Повідомлення відправлено на номер клієнту');
            ////cy.get('.ant-notification-notice-message').contains('Повідомлення відправлено');
        })
        .then(()=>{
            cy.log('Підтвердіть замовлення ч/з мобільний телефон');
        })
        .then(()=>{
            cy.get('#У > .styles-m__mapChildsBlock---1oGYD > :nth-child(3) > .ant-btn').click();
            cy.wait(1000);
            cy.pause()
        })
  });

  it('25.Редаг. Закуп. ціни / ПД Схвалено в табці Роботи', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
    .then(()=>{
        cy.log('Вибір Запису');
        cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
        cy.wait(2000);
        cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
        cy.log('Вкладка Роботи');
        cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(3)').click();
    })
    .then(()=>{
        cy.wait(1000);
        cy.get(':nth-child(1) > [title="Швидке редагування"] > div').first().click({force: true})
        cy.wait(1000);
    })
    .then(()=>{
        cy.log('Закупочна ціна');
        cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('88');
        cy.wait(1000);
        cy.get('.ant-btn-primary').last().click({force: true})
        cy.wait(1000);
    })
})

it('26. Редагування Закупочної ціни / ПД Схвалено в табці Запчастини', function(){
    cy.visit(approve)
    cy.get('.styles-m__logo---2zDPJ').click()
        .then(()=>{
            cy.wait(3000);
            cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
            cy.wait(2000);
            cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
            cy.log('Вибір Запису');
            cy.wait(1000);
        })
        .then(()=>{
            cy.log('Вкладка Запчастини');
            cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(4)').click();
            cy.wait(1000);
            cy.log('Швидке редагування запчастин');
            cy.get(':nth-child(4) > .ant-btn > div').first().click({force: true});
            cy.log('Вибір Запису');
            cy.wait(1000);
            cy.get(':nth-child(4) > .ant-input-number > .ant-input-number-input-wrap > .ant-input-number-input').clear().type('88');
        })
        .then(()=>{
            cy.wait(2000);
            cy.get('.ant-modal-footer > div > .ant-btn-primary').last().click({force: true}) //ok
            cy.wait(2000);
        })
})

it('27.Перевід у статус Ремонту', function(){
    cy.visit(approve);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Н/З');
    cy.wait(4000);
    cy.wait(7000);
    cy.log('Переведіть н/з в статус Ремонт');
    cy.get('.styles-m__dropdownTitle---3Vlog > :nth-child(2) > span').click();
    cy.wait(1000);
    cy.get('.ant-dropdown-menu-item').contains('Ремонт').click()
    cy.wait(3000);
})

it('28.Ремонт (Р)', function(){
  cy.visit(progress);
  cy.get('.styles-m__logo---2zDPJ').click()
  cy.wait(3000);
  cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
  cy.wait(2000);
  cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
  cy.log('Вибір Н/З');
  cy.wait(4000);
  cy.log('Розпочніть ремонт');
  cy.get('#Р > .styles-m__mapChildsBlock---1oGYD > :nth-child(2) > .ant-btn').click();
  cy.wait(2000);
  cy.log('Клік Старт');
  cy.get('[data-row-key="0"]> :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(1)').click()
  cy.wait(1000);
  cy.get('[data-row-key="1"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(1)').click()
  cy.wait(1000);
  cy.get('[data-row-key="2"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(1)').click()
  cy.wait(1000);
  cy.get('[data-row-key="3"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(1)').click()
  cy.log('Клік Фініш');
  cy.get('[data-row-key="0"]> :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(2)').first().click({force: true});
  cy.wait(1000);
  cy.get('[data-row-key="1"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(2)').click()
  cy.wait(1000);
  cy.get('[data-row-key="2"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(2)').click()
  cy.wait(1000);
  cy.wait(1000);
  cy.get('[data-row-key="3"] > :nth-child(9) > .styles-m__laborStageButtonsGroup---1naL1 > :nth-child(2)').click()
  cy.wait(1000);
  cy.log('Клік Завершити');
  cy.get('[style="display: flex; justify-content: space-between; margin: 12px 0px;"] > :nth-child(3) > .ant-btn').click();
  cy.wait(2000);
})

  it('29.Оплата і видача (ОВ)', function(){
    cy.visit(progress);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(4000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Н/З');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(1)').click();
    cy.wait(1000);
    cy.log('Модалка Виконати наряд-замовлення?');
    cy.get('#ОВ > .styles-m__mapChildsBlock---1oGYD > :nth-child(3) > .ant-btn').click();
    cy.wait(1000);
    cy.log('Сплатити радіо-кнопка Так');
    cy.get('#withPayment > :nth-child(1) > :nth-child(2)').click();
    cy.wait(1000);
    cy.log('Вибір Каси');
    cy.get('#cashBoxId').click();
    cy.wait(1000);
    cy.get('.ant-select-dropdown-menu-item').eq(0).click();
    cy.wait(1000);
    cy.get('.styles-m__submit---2hKgG > .ant-btn-primary').click();
    cy.wait(9000);
    cy.get('.styles-m__title---Nwr2X').contains('Виконано')
    cy.wait(4000);
  });

  it('30. Статистика по НЗ', function(){
    cy.visit(success);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(4000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Н/З');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(1)').click();
    cy.wait(1000);
    cy.get('.anticon-info-circle').click({force: true})
    cy.wait(3000);
    cy.get('.ant-modal-wrap > .ant-modal > .ant-modal-content > .ant-modal-body').should('exist');
    cy.get('#rcDialogTitle4 > :nth-child(1)').contains('Завершено').should('exist');
  });

it('31.Завантаження НЗ для Клієнта', function(){
  cy.visit(success);
  cy.get('.styles-m__logo---2zDPJ').click()
  cy.wait(3000);
  cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
  cy.wait(2000);
  cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
  cy.log('Вибір Н/З');
  cy.wait(4000);
  cy.get('.anticon-printer > svg').click();
  cy.log('Завантаження Наряд замовлення для Клієнта');
  cy.get('.ant-dropdown-menu-item').eq(5).click();
  cy.wait(7000);
});

it('32. Перевірка завантаженних файлів', function(){
  cy.visit(success);
  cy.get('.styles-m__logo---2zDPJ').click()
  cy.wait(3000);
  cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
  cy.wait(2000);
  cy.get('a.styles-m__ordernLink---T-qWz').first().invoke('text')
        .then (text => {codeNZ = text;
        cy.log(codeNZ)
        const path = require("path");
      ////  cy.readFile(path.join('cypress/downloads', 'act-'+codeNZ+'.pdf')).should("exist"); // файл Акт прийому-передачі автомобіля
        cy.wait(1000);
        cy.readFile(path.join('cypress/downloads', 'order-'+codeNZ+'.pdf')).should("exist"); // файл Наряд замовлення для Клієнта
     //  // cy.wait(1000);
       //// cy.readFile(path.join('cypress/downloads', 'invoice-'+codeNZ+'.pdf')).should("exist");
  })
});

  it('33. Додавання Коментарів', function(){
    cy.visit(success);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(4000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Н/З');
    cy.wait(4000);
    cy.get('#ОВ > .styles-m__mapChildsBlock---1oGYD > :nth-child(2) > .ant-btn').click();
    cy.wait(1000);
    cy.get('.ant-tabs-tabpane-active > :nth-child(2) > .ant-form-item-label > label').should('exist');
    cy.get('#comment').type('ХХХ');
    ///////cy.get('.styles-m__commentsBlock---vzjO9 > .ant-row > .ant-form-item-label > label').contains('ZZZ');
    cy.log('Стан автомобіля');
    cy.get('#vehicleCondition').type('YYY');
    cy.get('.ant-tabs-tabpane-active > :nth-child(3) > .ant-form-item-label').should('exist');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(6)').contains('2')
    });

  it('34. Вкладка Історія в н/з', function(){
    cy.visit(success);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Запису');
    cy.wait(4000);
    cy.log('Для нового клієнта історія містить 1 елемент');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(7)').click();
    cy.get('.ant-table-row > :nth-child(2) > a').should('exist');
  });

  it('35. Вкладка Пост в н/з', function(){
    cy.visit(success);
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.wait(3000);
    cy.get('.ant-input-search > .ant-input').type(idClient)//пошук
    cy.wait(2000);
    cy.get('a.styles-m__ordernLink---T-qWz').first().click({force: true});
    cy.log('Вибір Запису');
    cy.wait(4000);
    cy.log('Вкладка Пост');
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(10)').contains('Пост')
    cy.get('.ant-tabs-nav > :nth-child(1) > :nth-child(10)').click();
    cy.get('.styles-m__staticStationLoadsRow---MnLCJ > :nth-child(1)').should('exist');
  });

  it('36. Перевірка відкриття модалки створення Працівника', function(){
    cy.get(':nth-child(2) > .ant-menu-submenu-title').click().should('exist');
    cy.contains('Працівники').click()
        .then(()=>{
            cy.get('.ant-btn').click()
            cy.wait(2000)
            cy.get('.ant-form').should('exist');
            cy.get('#jobTitle').type('Test').should('exist');
        })
  });

  it('37. Перевірка відкриття картки існуючого Працівника', function(){
    cy.get(':nth-child(2) > .ant-menu-submenu-title').click().should('exist');
    cy.contains('Працівники').click()
        .then(()=>{
            cy.get('.styles-m__employeeName---2QyjT').first().click({force: true})
            cy.wait(2000)
            cy.get('.ant-tabs').should('exist');
            cy.wait(2000)
            cy.get(':nth-child(1) > .ant-row > .ant-col-18').contains('Менеджерський доступ');
        })
  });

  it('38. Перевірка відкриття сторінки Деталі в Роботі', function(){
    cy.get('.styles-m__logo---2zDPJ').click()
    cy.get(':nth-child(5) > a').first().click({force: true})
        .then(()=>{
          cy.get('.styles-m__minimized---2nM6M > .ant-btn').click() // фільтр дата
          cy.wait(2000)
          cy.get('.styles-m__filterDateButtons---QBBQy > :nth-child(5)').click() // фільтр Рік
          cy.wait(5000)
          cy.get('.ant-dropdown-menu > :nth-child(1) > span').first().click({force: true}) // Фільтри поточний рік
          cy.get('.styles-m__headerContorls---2pU_V > .ant-radio-group > :nth-child(2)').click()
          cy.get('.anticon-sort-ascending').click()
          cy.wait(2000)
          cy.get('.ant-dropdown-menu > :nth-child(4) > div').click()
          cy.wait(2000)
          cy.get('[data-row-key="ENTER_DATA"] > :nth-child(2)').should('exist');
          cy.get('.anticon-sort-ascending').click() //Сортування за постачальником
          cy.get('.ant-dropdown-menu > :nth-child(2) > div > span').click({force: true})
          cy.get('[data-row-key="0"] > :nth-child(2)').should('exist');
        })
  });
})