# Alyon Vault L2

App per tenere il conto dei raid fatti con ogni personaggio, su piu' server
Lineage 2, con le password degli account a portata di mano.

**Indirizzo:** https://alyonhd-lgtm.github.io/alyon-vault/

---

## Come si installa

Aprire l'indirizzo con Chrome o Edge. Nella barra degli indirizzi compare
l'icona **Installa** (un monitor con una freccia); in alternativa menu **⋮ →
Trasmetti, salva e condividi → Installa questa pagina come app**.

Da quel momento l'app sta nel menu Start e si apre in una finestra sua, senza
barre del browser. Funziona anche senza rete.

Su Android: menu **⋮ → Aggiungi a schermata Home**.

## Dove finiscono i dati

Nella memoria del browser del dispositivo (`localStorage`), sotto la chiave
`raid-board-v2`. **Non salgono su GitHub**: qui c'e' solo il programma, mai i
dati. Le password restano quindi sul computer e basta.

Conseguenza: svuotare i dati di navigazione cancella anche le spunte. Il
pulsante **Salva copia** produce un file `.json` da tenere da parte ogni tanto,
e **Carica copia** lo rimette dentro.

## Come si aggiorna

Ogni apertura l'app chiede a GitHub se c'e' una versione nuova e la prende. Se
la rete manca, parte con la copia che ha gia'. Non c'e' niente da reinstallare.

Dopo aver modificato i file, alzare `VERSIONE` in `sw.js` e pubblicare:

```
git add -A && git commit -m "descrizione" && git push
```

GitHub Pages ci mette un minuto o due a servire la versione nuova.

## I file

| File | Cosa |
|---|---|
| `index.html` | tutta l'app: aspetto, programma e dati di partenza |
| `manifest.webmanifest` | nome, icone e modo di apertura per l'installazione |
| `sw.js` | tiene la copia locale e fa arrivare gli aggiornamenti |
| `icona-*.png` | le icone dell'app |

Tutto in un file solo, senza impalcature da compilare: `index.html` si apre
anche a doppio clic da disco, funziona lo stesso, ma cosi' non si aggiorna da
solo e non si installa.

## Struttura dei dati

```
server[]
  nome
  raid[]      -> id, nome, colore
  account[]   -> id, nome, classe, password, pg[]
  fatte[]     -> "idPersonaggio|idRaid"
```

Gli identificativi non cambiano mai: rinominare un personaggio o un raid non
tocca le spunte gia' fatte.
