from pathlib import Path
p=Path('october/index.html')
s=p.read_text(encoding='utf-8')
repls={
'<div class="meta">− 03:45 civarı shuttle durağına valizle yürümek yerine taksi daha mantıklı.</div>':'<div class="meta">− Holiday Inn shuttle durağına yürüyüş, mevcut 17:50 dönüş uçuşunda kullanılabilir bir seçenek.</div>',
'<div class="meta">− Çok erken dönüşte shuttle durağına valizle yürüyüş ideal değil.</div>':'<div class="meta">− Holiday Inn shuttle durağına valizle yürüyüş, mevcut 17:50 dönüş uçuşunda yapılabilir.</div>'
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit('Missing old return reference: '+old)
    s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('Cleaned remaining early-return references')