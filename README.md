# Pix Fácil - Aplicativo de Pagamentos PIX

## 🚀 Funcionalidades

- ✅ **Interface Moderna**: Design responsivo com Tailwind CSS
- ✅ **Animações Suaves**: Sistema completo de animações e transições
- ✅ **Loading States**: Componentes de carregamento e feedback visual
- ✅ **Toast Notifications**: Sistema de notificações integrado
- ✅ **Aplicativo Mobile**: Suporte nativo com Capacitor
- ✅ **Testes Automatizados**: Configuração de testes com Vitest
- ✅ **CI/CD**: Pipeline automatizado com GitHub Actions

## 🛠️ Tecnologias

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Vite** - Build tool
- **Shadcn/ui** - Componentes UI

### Mobile
- **Capacitor** - Desenvolvimento mobile nativo
- **Android/iOS** - Suporte multiplataforma

### Testes & CI/CD
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes
- **GitHub Actions** - Automação CI/CD

## 🎨 Sistema de Design

### Animações Disponíveis
```tsx
// Animações básicas
className="animate-fade-in"     // Fade in suave
className="animate-scale-in"    // Scale in
className="animate-slide-in"    // Slide da direita

// Animações interativas
className="hover-scale"         // Hover com scale
className="story-link"          // Link com underline animado
className="loading-pulse"       // Pulse lento para loading
```

### Componentes de Loading
```tsx
// Spinner de carregamento
<LoadingSpinner size="sm|md|lg" />

// Botão com loading
<LoadingButton loading={isLoading} loadingText="Carregando...">
  Ação
</LoadingButton>

// Skeleton loading
<Skeleton className="h-4 w-full" />
```

### Hook de Loading
```tsx
const { isLoading, withLoading, error } = useLoading();

// Uso com operações async
const handleAction = async () => {
  await withLoading(async () => {
    // Sua operação async aqui
  });
};
```

## 📱 Desenvolvimento Mobile

### Configuração Inicial
```bash
# Instalar dependências (já incluídas)
npm install

# Inicializar Capacitor (já configurado)
npx cap init

# Adicionar plataformas
npx cap add android
npx cap add ios

# Sincronizar projeto
npx cap sync
```

### Executar no Mobile
```bash
# Android
npx cap run android

# iOS (requer macOS e Xcode)
npx cap run ios
```

### Build para Produção
```bash
# Build web
npm run build

# Sincronizar com mobile
npx cap sync

# Build Android
npx cap build android --prod
```

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Estrutura de Testes
```
src/
├── components/
│   └── __tests__/           # Testes de componentes
├── hooks/
│   └── __tests__/           # Testes de hooks
└── test/
    └── setup.ts             # Configuração global
```

## 🔄 CI/CD Pipeline

### GitHub Actions
O projeto inclui pipeline automatizado que:

1. **Testes** - Executa em Node 18.x e 20.x
2. **Linting** - Verifica qualidade do código
3. **Build** - Compila para produção
4. **Mobile Build** - Prepara builds mobile
5. **Deploy** - Deploy automático (configurar)

### Configuração
```yaml
# .github/workflows/ci.yml
- Testes automatizados em PRs
- Build e deploy em push para main
- Suporte a builds mobile
- Upload de artefatos
```

## 🚀 Deploy

### Web
```bash
# Build
npm run build

# Deploy (configurar seu provedor)
# Vercel, Netlify, etc.
```

### Mobile
```bash
# Preparar build
npm run build
npx cap sync

# Android (Play Store)
npx cap build android --prod

# iOS (App Store)
npx cap build ios --prod
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                  # Componentes base
│   ├── mobile/              # Componentes mobile
│   └── examples/            # Exemplos de uso
├── hooks/                   # Custom hooks
├── pages/                   # Páginas da aplicação
├── services/                # Serviços e APIs
└── test/                    # Configuração de testes
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.