# Multi-Unit Domain Context

Glossary of domain terms and architectural concepts related to Multi-Unit, Active Unit, and Unit Switcher for the POS Application Frontend.

## Unit

Entitas bisnis (toko/cabang) yang menjadi scope operasional. Seorang user bisa punya akses ke satu atau beberapa unit, atau akses global (semua unit). Unit aktif disimpan di localStorage dan React Context.

## Active Unit

Unit yang sedang dipilih user di unit switcher. Menentukan scope data yang ditampilkan dan permission efektif yang berlaku untuk sesi tersebut.

## Unit Switcher

Elemen UI wajib di header aplikasi yang memungkinkan user berpindah antara unit yang dapat diaksesnya. Perubahan unit memicu recompute Effective Permissions.
