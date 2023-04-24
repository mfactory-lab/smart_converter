# smart-converter v.0.0.1

Smart-converter program.

# Setup

1. Build the program:

```bash
make build
```

2. Generate an SDK:

```bash
pnpm api:gen
```

3. Set the cluster to deploy to:

```bash
solana config set --url <CLUSTER>
```

Where CLUSTER is a Solana cluster address.

4. Deploy the program:

```bash
anchor deploy
```

5. Run tests:

```bash
make test
```
