# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Pix Fácil! Este documento fornece diretrizes para contribuições.

## 📋 Antes de Começar

1. **Leia o README**: Familiarize-se com o projeto
2. **Verifique as Issues**: Veja se já existe uma issue relacionada
3. **Discuta Mudanças Grandes**: Para mudanças significativas, abra uma issue primeiro

## 🐛 Reportando Bugs

### Antes de Reportar
- Verifique se o bug já foi reportado
- Teste na versão mais recente
- Colete informações do ambiente

### Template de Bug Report
```markdown
**Descrição do Bug**
Descrição clara e concisa do problema.

**Reprodução**
Passos para reproduzir:
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**
- OS: [ex: iOS, Android, Windows]
- Browser: [ex: Chrome, Safari]
- Versão: [ex: 1.1.0]
```

## ✨ Sugerindo Melhorias

### Template de Feature Request
```markdown
**Problema Relacionado**
Descreva o problema que esta feature resolveria.

**Solução Proposta**
Descrição clara da solução desejada.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Informações Adicionais**
Contexto adicional sobre a feature.
```

## 💻 Contribuindo com Código

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
git clone https://github.com/SEU-USUARIO/pix-facil.git
cd pix-facil
```

### 2. Configuração do Ambiente
```bash
# Instale as dependências
npm install

# Configure o git
git config user.name "Seu Nome"
git config user.email "seu.email@exemplo.com"

# Configure os hooks
npm run prepare
```

### 3. Criando uma Branch
```bash
# Para novas features
git checkout -b feature/nome-da-feature

# Para correções de bugs
git checkout -b fix/nome-do-bug

# Para melhorias
git checkout -b improvement/nome-da-melhoria
```

### 4. Desenvolvendo

#### Padrões de Código
- **TypeScript**: Use tipagem sempre que possível
- **ESLint**: Siga as regras configuradas
- **Prettier**: Formate o código antes do commit
- **Conventional Commits**: Use o padrão para mensagens

#### Estrutura de Commits
```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

**Tipos:**
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `docs`: documentação
- `style`: formatação de código
- `refactor`: refatoração
- `test`: testes
- `chore`: manutenção

**Exemplos:**
```bash
git commit -m "feat(pix): adiciona validação de chave aleatória"
git commit -m "fix(qr): corrige geração de QR code inválido"
git commit -m "docs(readme): atualiza instruções de instalação"
```

### 5. Testes

#### Executando Testes
```bash
# Todos os testes
npm run test

# Testes específicos
npm run test -- usePixStore

# Com cobertura
npm run test:coverage
```

#### Escrevendo Testes
- **Unitários**: Para hooks, utils e services
- **Componentes**: Para componentes React
- **Integração**: Para fluxos completos

**Exemplo de teste:**
```typescript
import { describe, it, expect } from 'vitest';
import { usePixStore } from '@/hooks/usePixStore';

describe('usePixStore', () => {
  it('should add pix key correctly', () => {
    const { addPixKey, pixKeys } = usePixStore.getState();
    
    addPixKey({
      type: 'cpf',
      value: '12345678901',
      name: 'João Silva',
      isPrimary: true,
    });

    expect(pixKeys).toHaveLength(1);
    expect(pixKeys[0].name).toBe('João Silva');
  });
});
```

### 6. Enviando Mudanças

#### Antes do Push
```bash
# Execute os checks
npm run lint
npm run type-check
npm run test
npm run build
```

#### Push e PR
```bash
# Push da branch
git push origin feature/nome-da-feature

# Crie um Pull Request no GitHub
```

## 📝 Pull Request Guidelines

### Template de PR
```markdown
## Descrição
Breve descrição das mudanças.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Melhoria de performance
- [ ] Refatoração
- [ ] Documentação

## Como Testar
1. Passo a passo para testar

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Build está passando
- [ ] Todos os testes estão passando
```

### Processo de Review
1. **Automated Checks**: CI/CD deve passar
2. **Code Review**: Pelo menos 1 aprovação
3. **Testing**: Testado em diferentes ambientes
4. **Merge**: Squash and merge preferido

## 🎨 Padrões de Design

### Componentes
- Use TypeScript interfaces para props
- Implemente temas (light/dark)
- Siga acessibilidade (ARIA, semantic HTML)
- Use semantic tokens do design system

### Responsividade
- Mobile-first approach
- Teste em diferentes dispositivos
- Use breakpoints consistentes

## 📚 Recursos Úteis

### Documentação
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

### Ferramentas
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## ❓ Dúvidas?

- **Discord**: [Servidor da Comunidade](https://discord.gg/pixfacil)
- **Email**: dev@pixfacil.com
- **Issues**: Para discussões técnicas

## 🙏 Reconhecimento

Todos os contribuidores serão reconhecidos no README e releases.

---

**Obrigado por contribuir! 🚀**