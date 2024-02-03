describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`);
    const user = {
      name: 'Test User',
      username: 'test',
      password: 'test',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user);
    const otherUser = {
      name: 'Other User',
      username: 'other',
      password: 'user',
    };
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, otherUser);
    cy.visit('');
  });

  it('Login form is shown', function () {
    cy.contains('log in to application');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('test');
      cy.get('#password').type('test');
      cy.get('#login-button').click();
      cy.contains('Test User logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('log in').click();
      cy.get('#username').type('wrong');
      cy.get('#password').type('wrong');
      cy.get('#login-button').click();

      cy.get('#notification').should('contain', 'wrong credentials');
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)');
      cy.get('#notification').should('have.css', 'border-style', 'solid');

      cy.get('html').should('not.contain', 'Test User logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test', password: 'test' });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('test title');
      cy.get('#author').type('test author');
      cy.get('#url').type('test url');
      cy.get('#submit-blog').click();
      cy.contains('test title test author');
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'test title',
          author: 'test author',
          url: 'test url',
        });
      });

      it('blog can be liked', function () {
        cy.contains('test title test author').contains('view').click();
        cy.get('.likes').should('have.text', '0');
        cy.contains('like').click();
        cy.get('.likes').should('have.text', '1');
      });

      it('blog can be deleted', function () {
        cy.contains('test title test author').contains('view').click();
        cy.contains('remove').click();
        cy.get('#notification').should('contain', 'blog removed successfully');
        cy.get('html').should('not.contain', 'test title test author');
      });

      describe('other user logged in', function () {
        beforeEach(function () {
          cy.contains('logout').click();
          cy.get('#username').type('other');
          cy.get('#password').type('user');
          cy.get('#login-button').click();
        });

        it('remove button hidden for other users', function () {
          cy.contains('test title test author').contains('view').click();
          cy.get('.remove-button').should('not.exist');
        });
      });
    });

    describe('and multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'test author',
          url: 'test url',
        });
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'test author',
          url: 'test url',
        });
        cy.contains('The title with the most likes')
          .parent()
          .within(() => {
            cy.contains('view').click();
            cy.contains('like').click();
          });
      });

      it('blog are ordered according to likes', function () {
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes');
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes');
      });
    });
  });
});
