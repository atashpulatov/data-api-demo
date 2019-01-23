# Generate private key

```bash
$ openssl genrsa -out private.key 4096
```

# Generate a Certificate Signing Request

```bash
openssl req -new -sha256 \
    -out private.csr \
    -key private.key \
    -config ssl.conf 
```

# Generate the certificate

```bash
openssl x509 -req \
    -days 3650 \
    -in private.csr \
    -signkey private.key \
    -out private.crt \
    -extensions req_ext \
    -extfile ssl.conf
```

# Add the certificate to keychain and trust it:

```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain private.crt
```

# Create a pem file from crt

```bash
openssl x509 -in private.crt -out private.pem -outform PEM
```

# Run webpack dev server 

```bash
npm run webpack-dev-server -- --open --https --cert private.pem --key private.key
```

# PROFIT $$
