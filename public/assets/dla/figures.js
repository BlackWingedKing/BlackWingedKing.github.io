const NS = "http://www.w3.org/2000/svg";
const key = ([x, y]) => `${x},${y}`;
const adjacent = (p, occupied) =>
  [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ].some(([dx, dy]) => occupied.has(key([p[0] + dx, p[1] + dy])));
function svgGrid(size, cells, label) {
  const unit = 300 / size;
  return `<svg viewBox="0 0 320 320" role="img" aria-label="${label}"><g transform="translate(10 10)">${Array.from(
    { length: size * size },
    (_, i) => {
      const x = i % size,
        y = Math.floor(i / size),
        c = cells.get(key([x, y])) || {};
      return `<rect x="${x * unit}" y="${y * unit}" width="${unit}" height="${unit}" fill="${c.fill || "#ffffff"}" stroke="${c.stroke || "#dce4e9"}" stroke-width="${c.stroke ? 2.5 : 0.7}"/>${c.text ? `<text x="${(x + 0.5) * unit}" y="${(y + 0.5) * unit}" text-anchor="middle" dominant-baseline="central" font-size="${size <= 5 ? 16 : 13}" font-weight="600" fill="${c.color || "#24394c"}">${c.text}</text>` : ""}`;
    }
  ).join("")}</g></svg>`;
}

class DlaIntro extends HTMLElement {
  connectedCallback() {
    this.connected = true;
    if (this.ready) {
      this.syncPlayback();
      return;
    }
    this.ready = true;
    // Chosen short paths explain the rule; they are not a timing experiment.
    this.paths = [
      [
        [0, 4],
        [0, 4],
        [1, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [3, 6],
        [2, 6],
        [2, 7],
        [3, 7],
        [4, 7],
        [4, 6],
        [5, 6],
        [5, 7],
        [6, 7],
      ],
      [
        [9, 0],
        [9, 1],
        [10, 1],
        [10, 2],
        [9, 2],
        [9, 3],
        [8, 3],
        [8, 4],
        [8, 5],
        [7, 5],
        [7, 6],
      ],
      [
        [6, 14],
        [6, 13],
        [5, 13],
        [5, 12],
        [6, 12],
        [7, 12],
        [7, 11],
        [6, 11],
        [6, 10],
        [5, 10],
        [5, 9],
        [6, 9],
        [6, 8],
      ],
    ];
    const occupied = new Set(["7,7"]);
    for (const path of this.paths) {
      if (!path[0].some(v => v === 0 || v === 14))
        throw Error("Demo must spawn at boundary");
      path.forEach((p, i) => {
        if (occupied.has(key(p)) || p.some(v => v < 0 || v > 14))
          throw Error("Invalid illustrative cell");
        if (
          i &&
          Math.abs(p[0] - path[i - 1][0]) + Math.abs(p[1] - path[i - 1][1]) > 1
        )
          throw Error("Non-cardinal demo move");
        if (adjacent(p, occupied) !== (i === path.length - 1))
          throw Error("Demo must stick on first contact");
      });
      occupied.add(key(path.at(-1)));
    }
    this.innerHTML = `<figure class="dla-intro-figure"><div class="dla-picture" tabindex="0" aria-label="Random walk and attachment animation. Hover or focus to pause."></div><figcaption><h3>Random walk and attachment</h3><div class="dla-key"><span><i class="dla-dot" style="background:#253a50"></i>cluster</span><span><i class="dla-dot" style="background:#25b6c4"></i>particle</span></div><p class="dla-muted">Illustrative paths · full stickiness. Hover or focus to pause.</p></figcaption></figure>`;
    const picture = this.querySelector(".dla-picture");
    picture.onmouseenter = () => {
      this.hovered = true;
      this.syncPlayback();
    };
    picture.onmouseleave = () => {
      this.hovered = false;
      this.syncPlayback();
    };
    picture.onfocus = () => {
      this.focused = true;
      this.syncPlayback();
    };
    picture.onblur = () => {
      this.focused = false;
      this.syncPlayback();
    };
    this.motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    this.motionPreference.onchange = () => this.syncPlayback();
    this.reset();
    this.syncPlayback();
  }
  pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  syncPlayback() {
    const shouldRun =
      this.connected &&
      !this.motionPreference.matches &&
      !this.hovered &&
      !this.focused;
    if (!shouldRun) this.pause();
    else if (!this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(t => this.tick(t));
    }
  }
  reset() {
    this.particle = 0;
    this.step = 0;
    this.done = false;
    this.hold = false;
    this.occupied = new Set(["7,7"]);
    this.render();
  }
  tick(now) {
    if (!this.running) return;
    if (!this.last || now - this.last >= 240) {
      this.last = now;
      this.advance();
    }
    if (this.running) this.raf = requestAnimationFrame(t => this.tick(t));
  }
  advance() {
    if (this.done) {
      this.reset();
      return;
    }
    const path = this.paths[this.particle];
    if (this.hold) {
      this.hold = false;
      this.particle++;
      this.step = 0;
      if (this.particle === this.paths.length) this.done = true;
    } else {
      this.step++;
      if (this.step === path.length - 1) {
        this.occupied.add(key(path[this.step]));
        this.hold = true;
      }
    }
    this.render();
  }
  render() {
    const cells = new Map();
    for (const p of this.occupied) cells.set(p, { fill: "#253a50" });
    if (!this.done && !this.hold) {
      const path = this.paths[this.particle];
      cells.set(key(path[this.step]), { fill: "#25b6c4" });
    }
    this.querySelector(".dla-picture").innerHTML = svgGrid(
      15,
      cells,
      "A particle random-walks from the boundary and attaches on contact with the cluster"
    );
  }
  disconnectedCallback() {
    this.connected = false;
    this.hovered = false;
    this.focused = false;
    this.pause();
  }
}

// Solve the same finite-grid absorption problem as the article, on a small grid.
function attachmentDistribution(size, occupied) {
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const free = [];
  const boundary = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (occupied.has(key([x, y]))) continue;
      const cell = [x, y];
      free.push(cell);
      if (x === 0 || y === 0 || x === size - 1 || y === size - 1)
        boundary.push(cell);
    }
  }
  if (!boundary.length) return [];
  const sites = free
    .filter(p => adjacent(p, occupied))
    .map(([x, y], i) => ({
      x,
      y,
      label: String(i + 1),
      mass: 0,
    }));
  const contacts = new Map(sites.map((s, i) => [key([s.x, s.y]), i]));
  const freeKeys = new Set(free.map(key));
  // Sealed pockets cannot receive a launched walker and must not enter the solve.
  const wandering = [];
  const index = new Map();
  const visit = p => {
    const k = key(p);
    if (freeKeys.has(k) && !contacts.has(k) && !index.has(k)) {
      index.set(k, wandering.length);
      wandering.push(p);
    }
  };
  boundary.forEach(visit);
  for (let i = 0; i < wandering.length; i++) {
    const [x, y] = wandering[i];
    for (const [dx, dy] of directions) visit([x + dx, y + dy]);
  }
  const n = wandering.length;
  const matrix = Array.from({ length: n }, (_, i) => {
    const row = new Float64Array(n + 1);
    row[i] = 1;
    return row;
  });
  for (const p of boundary) {
    const k = key(p);
    if (contacts.has(k)) sites[contacts.get(k)].mass += 1 / boundary.length;
    else matrix[index.get(k)][n] += 1 / boundary.length;
  }
  wandering.forEach(([x, y], source) => {
    for (const [dx, dy] of directions) {
      const destination = key([x + dx, y + dy]);
      if (!freeKeys.has(destination)) matrix[source][source] -= 0.25;
      else if (index.has(destination))
        matrix[index.get(destination)][source] -= 0.25;
    }
  });
  // Partial pivoting keeps this tiny dense solve independent of a numerical library.
  for (let column = 0; column < n; column++) {
    let pivot = column;
    for (let row = column + 1; row < n; row++)
      if (Math.abs(matrix[row][column]) > Math.abs(matrix[pivot][column]))
        pivot = row;
    if (Math.abs(matrix[pivot][column]) < 1e-14)
      throw Error("Singular attachment system");
    [matrix[column], matrix[pivot]] = [matrix[pivot], matrix[column]];
    for (let row = column + 1; row < n; row++) {
      const scale = matrix[row][column] / matrix[column][column];
      if (scale === 0) continue;
      matrix[row][column] = 0;
      for (let j = column + 1; j <= n; j++)
        matrix[row][j] -= scale * matrix[column][j];
    }
  }
  const visits = new Float64Array(n);
  for (let row = n - 1; row >= 0; row--) {
    let value = matrix[row][n];
    for (let column = row + 1; column < n; column++)
      value -= matrix[row][column] * visits[column];
    visits[row] = value / matrix[row][row];
  }
  wandering.forEach(([x, y], source) => {
    for (const [dx, dy] of directions) {
      const contact = contacts.get(key([x + dx, y + dy]));
      if (contact !== undefined) sites[contact].mass += 0.25 * visits[source];
    }
  });
  const total = sites.reduce((sum, site) => sum + site.mass, 0);
  if (
    !Number.isFinite(total) ||
    Math.abs(total - 1) > 1e-9 ||
    sites.some(s => s.mass < -1e-12)
  )
    throw Error("Invalid attachment distribution");
  for (const site of sites) site.mass = Math.max(0, site.mass) / total;
  return sites;
}

class DlaProbabilities extends HTMLElement {
  connectedCallback() {
    if (this.ready) return;
    this.ready = true;
    this.size = 13;
    this.innerHTML = `<div class="dla-figure-grid"><div class="dla-picture"></div><div><h3>Grow the cluster, one sample at a time</h3><p>Each click adds one particle, then calculates a new distribution for the neighboring cells.</p><div class="dla-controls"><button data-sample>Sample next particle</button><button data-reset>Reset cluster</button></div><output class="dla-status" aria-live="polite"></output><div class="dla-bars" role="group" aria-label="Current attachment distribution"></div><p class="dla-muted">13 × 13 grid · full stickiness · uniform launch from empty edge cells. Purple cells show the next attachment distribution; blue marks the last addition.</p></div></div>`;
    this.querySelector("[data-sample]").onclick = () => this.sample();
    this.querySelector("[data-reset]").onclick = () => this.reset();
    this.reset();
  }
  reset() {
    const center = Math.floor(this.size / 2);
    this.occupied = new Set([key([center, center])]);
    this.last = null;
    this.update();
  }
  sample() {
    if (!this.sites.length) return;
    let cumulative = 0;
    const draw = Math.random();
    const selected =
      this.sites.find(s => (cumulative += s.mass) > draw) ||
      this.sites.findLast(s => s.mass > 0);
    this.last = [selected.x, selected.y];
    this.occupied.add(key(this.last));
    this.update();
  }
  update() {
    try {
      this.sites = attachmentDistribution(this.size, this.occupied);
      this.querySelector("[data-sample]").disabled = !this.sites.length;
      this.render();
    } catch (error) {
      this.sites = [];
      this.querySelector("[data-sample]").disabled = true;
      this.querySelector(".dla-status").textContent =
        "The distribution could not be calculated. Reset the cluster to try again.";
      console.error(error);
    }
  }
  render() {
    const cells = new Map(
      [...this.occupied].map(p => [p, { fill: "#253a50" }])
    );
    const peak = Math.max(0, ...this.sites.map(s => s.mass));
    for (const site of this.sites) {
      const strength = peak ? site.mass / peak : 0;
      cells.set(key([site.x, site.y]), {
        fill: `hsl(260 50% ${96 - 28 * strength}%)`,
        text: site.label,
      });
    }
    if (this.last)
      cells.set(key(this.last), { fill: "#25b6c4", stroke: "#146f7d" });
    this.querySelector(".dla-picture").innerHTML = svgGrid(
      this.size,
      cells,
      "Growing cluster and its recalculated attachment distribution"
    );
    const barWidth = 270 / Math.max(1, this.sites.length);
    const bars = this.sites
      .map((site, i) => {
        const height = peak ? (96 * site.mass) / peak : 0;
        const x = 40 + i * barWidth;
        const label = `Cell ${site.label}: ${(100 * site.mass).toFixed(2)}%`;
        return `<g><title>${label}</title><rect x="${x}" y="${110 - height}" width="${Math.max(1, barWidth - 1)}" height="${height}" fill="#7857c6"/>${this.sites.length <= 12 ? `<text x="${x + barWidth / 2}" y="126" text-anchor="middle">${site.label}</text>` : ""}</g>`;
      })
      .join("");
    const description = this.sites
      .map(site => `Cell ${site.label}: ${(100 * site.mass).toFixed(2)}%`)
      .join("; ");
    this.querySelector(".dla-bars").innerHTML =
      `<svg viewBox="0 0 320 140" role="img" aria-label="Current attachment distribution"><desc>${description || "No empty edge cells remain."}</desc><text x="35" y="18" text-anchor="end">${(100 * peak).toFixed(1)}%</text><text x="35" y="113" text-anchor="end">0%</text><path d="M40 10V110H310" fill="none" stroke="#b8c5d0"/>${bars}<text x="175" y="139" text-anchor="middle">Neighboring cells</text></svg>`;
    this.querySelector(".dla-status").textContent = this.sites.length
      ? `Particles added: ${this.occupied.size - 1} · Neighboring cells: ${this.sites.length}. ${this.last ? "Distribution recalculated for the next particle." : "Sample a particle to start growing."}`
      : "The grid edge is full, so no new particle can start. Reset to grow another cluster.";
  }
}

class DlaSquare extends HTMLElement {
  connectedCallback() {
    if (this.ready) return;
    this.ready = true;
    this.sites = [];
    for (let k = 1; k <= 3; k++)
      for (const p of [
        [k, 0],
        [4, k],
        [4 - k, 4],
        [0, 4 - k],
      ])
        this.sites.push({ p, mass: k === 2 ? 1 / 8 : 1 / 16 });
    if (this.sites.reduce((s, p) => s + p.mass, 0) !== 1)
      throw Error("Exit mass must sum to one");
    this.innerHTML = `<div class="dla-figure-grid"><div class="dla-picture"></div><div><h3>A square has a known exit law</h3><p>Start at the center. Each side gets ¼ of the probability, but its middle is twice as likely as either neighboring exit cell. Corners cannot be the first exit.</p><div class="dla-controls"><button>Sample an exit</button></div><output class="dla-status" aria-live="polite">Choose an endpoint using these weights; omit the interior walk.</output><p class="dla-muted">Radius 2, exact discrete probabilities. Use a square only when its interior contains no attachment sites.</p></div></div>`;
    this.querySelector("button").onclick = () => {
      let u = Math.random(),
        sum = 0;
      const selected = this.sites.find(s => (sum += s.mass) > u);
      this.render(selected);
      this.querySelector("output").textContent =
        `Sampled exit (${selected.p[0] - 2}, ${selected.p[1] - 2}), probability ${selected.mass === 1 / 8 ? "1/8" : "1/16"}. This is an endpoint, not a straight-line physical path.`;
    };
    this.render();
  }
  render(selected) {
    const cells = new Map();
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 5; x++) cells.set(key([x, y]), { fill: "#eef6f7" });
    for (const p of [
      [0, 0],
      [4, 0],
      [0, 4],
      [4, 4],
    ])
      cells.set(key(p), { fill: "#f1f3f5", text: "0", color: "#758494" });
    for (const s of this.sites)
      cells.set(key(s.p), {
        fill:
          s === selected ? "#f8d491" : s.mass === 1 / 8 ? "#a9dce2" : "#d4edf0",
        text: s.mass === 1 / 8 ? "1/8" : "1/16",
        stroke: s === selected ? "#b77512" : null,
      });
    cells.set("2,2", { fill: "#7857c6", text: "start", color: "white" });
    this.querySelector(".dla-picture").innerHTML = svgGrid(
      5,
      cells,
      "Exact first-exit probabilities for a centered random walker in a radius-two square"
    );
  }
}
for (const [name, component] of [
  ["dla-intro", DlaIntro],
  ["dla-probabilities", DlaProbabilities],
  ["dla-square", DlaSquare],
])
  if (!customElements.get(name)) customElements.define(name, component);
