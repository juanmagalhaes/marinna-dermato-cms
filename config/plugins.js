module.exports = () => ({
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      landingPage: true, // Habilita o Sandbox em produção (temporário para debug)
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: true, // Habilita a introspecção do schema
      },
    },
  },
});
