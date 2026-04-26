<template>
  <div class="page">

    <!-- Back Button -->
    <div class="back-row">
      <router-link to="/rooms" class="back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        ត្រឡប់ទៅបន្ទប់
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>កំពុងផ្ទុកព័ត៌មានបន្ទប់...</p>
    </div>

    <div v-else>

      <!-- Room Header -->
      <div class="room-header">
        <div class="room-header-info">
          <div class="room-header-name">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            {{ roomName }}
          </div>
          <div class="room-header-tenant">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            អ្នកជួល: <strong>{{ tenantName }}</strong>
          </div>
        </div>
        <router-link :to="`/rooms/${roomId}/add-record`" class="btn-primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          បន្ថែមកំណត់ត្រាប្រចាំខែ
        </router-link>
      </div>

      <!-- No records -->
      <div v-if="records.length === 0" class="notice-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        រកមិនឃើញកំណត់ត្រាប្រចាំខែសម្រាប់បន្ទប់នេះ។
        <router-link :to="`/rooms/${roomId}/add-record`" class="notice-link">បន្ថែមកំណត់ត្រាដំបូង។</router-link>
      </div>

      <div v-else>

        <!-- ══════ Current Month Card ══════ -->
        <div v-if="current" class="card mb">

          <div class="card-head">
            <div class="card-head-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              កំណត់ត្រាថ្មីៗ — {{ current.month + '/' + current.day }}
            </div>
            <div class="card-head-actions">
              <button class="action-btn edit" @click="openEdit(current)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                កែប្រែ
              </button>
              <button class="action-btn delete" @click="confirmDelete(current.id)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                លុប
              </button>
            </div>
          </div>

          <div class="card-body">
            <div class="usage-grid">

              <!-- Electric -->
              <div v-if="current.electric_total > 0" class="usage-section elec">
                <div class="usage-section-title elec">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  អគ្គិសនី
                </div>
                <div class="usage-table">
                  <div class="usage-row"><span class="usage-lbl">លេខចាស់</span><span class="usage-val">{{ parseFloat(current.old_electric).toFixed(1) }} kWh</span></div>
                  <div class="usage-row"><span class="usage-lbl">លេខថ្មី</span><span class="usage-val">{{ parseFloat(current.new_electric).toFixed(1) }} kWh</span></div>
                  <div class="usage-row highlight"><span class="usage-lbl">ការប្រើប្រាស់</span><span class="usage-val elec">{{ parseFloat(current.electric_usage).toFixed(1) }} kWh</span></div>
                  <div class="usage-row"><span class="usage-lbl">តម្លៃក្នុង kWh</span><span class="usage-val">{{ formatKHR(current.electric_price) }} ៛</span></div>
                  <div class="usage-row total"><span class="usage-lbl">សរុប</span><span class="usage-val elec">{{ formatKHR(current.electric_total) }} ៛</span></div>
                </div>
                <div class="meter-imgs" v-if="current.old_electric_image || current.electric_image">
                  <div v-if="current.old_electric_image" class="meter-img-wrap">
                    <span class="meter-img-label">ខែមុន</span>
                    <img :src="getImageUrl(current.old_electric_image)" class="meter-img" @click="showImageModal(current.old_electric_image)" />
                  </div>
                  <div v-if="current.electric_image" class="meter-img-wrap">
                    <span class="meter-img-label">ខែនេះ</span>
                    <img :src="getImageUrl(current.electric_image)" class="meter-img" @click="showImageModal(current.electric_image)" />
                  </div>
                </div>
              </div>

              <!-- Water section — commented out, not needed for now
              <div v-if="current.water_total > 0" class="usage-section water">
                <div class="usage-section-title water">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
                  ទឹក
                </div>
                <div class="usage-table">
                  <div class="usage-row"><span class="usage-lbl">លេខចាស់</span><span class="usage-val">{{ parseFloat(current.old_water).toFixed(1) }} m³</span></div>
                  <div class="usage-row"><span class="usage-lbl">លេខថ្មី</span><span class="usage-val">{{ parseFloat(current.new_water).toFixed(1) }} m³</span></div>
                  <div class="usage-row highlight"><span class="usage-lbl">ការប្រើប្រាស់</span><span class="usage-val water">{{ parseFloat(current.water_usage).toFixed(1) }} m³</span></div>
                  <div class="usage-row"><span class="usage-lbl">តម្លៃក្នុង m³</span><span class="usage-val">{{ formatKHR(current.water_price) }} ៛</span></div>
                  <div class="usage-row total"><span class="usage-lbl">សរុប</span><span class="usage-val water">{{ formatKHR(current.water_total) }} ៛</span></div>
                </div>
                <div class="meter-imgs" v-if="current.old_water_image || current.water_image">
                  <div v-if="current.old_water_image" class="meter-img-wrap">
                    <span class="meter-img-label">ខែមុន</span>
                    <img :src="getImageUrl(current.old_water_image)" class="meter-img" @click="showImageModal(current.old_water_image)" />
                  </div>
                  <div v-if="current.water_image" class="meter-img-wrap">
                    <span class="meter-img-label">ខែនេះ</span>
                    <img :src="getImageUrl(current.water_image)" class="meter-img" @click="showImageModal(current.water_image)" />
                  </div>
                </div>
              </div>
              -->

            </div>

            <!-- Total Cost -->
            <div class="total-cost-row">
              <span class="total-cost-label">ចំនួនទឹកប្រាក់សរុបត្រូវបង់</span>
              <span class="total-cost-amount">{{ formatKHR(current.total_cost) }} ៛</span>
            </div>

            <!-- Invoice Actions -->
            <div class="invoice-row">
              <div class="date-fields">
                <div class="field">
                  <label class="field-label red">កាលបរិច្ឆេទបង់ប្រាក់</label>
                  <input v-model="payDate" type="date" />
                </div>
                <div class="field">
                  <label class="field-label amber">កាលបរិច្ឆេទផុតកំណត់</label>
                  <input v-model="expiredDate" type="date" />
                </div>
              </div>
              <button class="btn-success" :disabled="isGenerating || !current" @click="handleDownloadInvoice">
                <span v-if="isGenerating" class="spinner sm"></span>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                {{ isGenerating ? 'កំពុងបង្កើត PDF...' : 'ទាញយកវិក្កយបត្រ PDF' }}
              </button>
              <button class="btn-telegram" :disabled="isSending || !current" @click="handleSendTelegram">
  <span v-if="isSending" class="spinner sm"></span>
  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 2L11 13"></path>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
  {{ isSending ? 'កំពុងផ្ញើ ...' : 'ផ្ញើទៅ Telegram' }}
</button>
            </div>
          </div>
        </div>

        <!-- ══════ Previous Month Card ══════ -->
        <div v-if="previous" class="card mb">
          <div class="card-head secondary">
            <div class="card-head-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              កំណត់ត្រាមុន — {{ previous.month + '/' + previous.day }}
            </div>
            <div class="card-head-actions">
              <button class="action-btn edit" @click="openEdit(previous)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                កែប្រែ
              </button>
              <button class="action-btn delete" @click="confirmDelete(previous.id)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                លុប
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="usage-grid">
              <div class="usage-section elec muted">
                <div class="usage-section-title elec">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  អគ្គិសនី
                </div>
                <div class="usage-table">
                  <div class="usage-row"><span class="usage-lbl">ការប្រើប្រាស់</span><span class="usage-val">{{ parseFloat(previous.electric_usage).toFixed(1) }} kWh</span></div>
                  <div class="usage-row"><span class="usage-lbl">សរុប</span><span class="usage-val">{{ formatKHR(previous.electric_total) }} ៛</span></div>
                </div>
              </div>

              <!-- Previous water section — commented out, not needed for now
              <div class="usage-section water muted">
                <div class="usage-section-title water">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>
                  ទឹក
                </div>
                <div class="usage-table">
                  <div class="usage-row"><span class="usage-lbl">ការប្រើប្រាស់</span><span class="usage-val">{{ parseFloat(previous.water_usage).toFixed(1) }} m³</span></div>
                  <div class="usage-row"><span class="usage-lbl">សរុប</span><span class="usage-val">{{ formatKHR(previous.water_total) }} ៛</span></div>
                </div>
              </div>
              -->

            </div>
            <div class="prev-total">
              សរុបខែមុន: <strong>{{ formatKHR(previous.total_cost) }} ៛</strong>
            </div>
          </div>
        </div>

        <!-- ══════ Comparison Card ══════ -->
        <div v-if="current && previous" class="card mb">
          <div class="card-head secondary">
            <div class="card-head-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              ការប្រៀបធៀបពីខែទៅខែ
            </div>
          </div>
          <div class="card-body">
            <div class="compare-grid">

              <!-- Electric diff -->
              <div class="compare-box">
                <div class="compare-label">ការផ្លាស់ប្តូរអគ្គិសនី</div>
                <div class="compare-val" :class="diff.electric >= 0 ? 'up' : 'down'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline :points="diff.electric >= 0 ? '5 12 12 5 19 12' : '5 12 12 19 19 12'"/>
                  </svg>
                  {{ Math.abs(diff.electric).toFixed(1) }} kWh
                </div>
                <div class="compare-sub">{{ parseFloat(previous.electric_usage).toFixed(1) }} → {{ parseFloat(current.electric_usage).toFixed(1) }}</div>
              </div>

              <!-- Water diff — commented out, not needed for now
              <div class="compare-box">
                <div class="compare-label">ការផ្លាស់ប្តូរទឹក</div>
                <div class="compare-val" :class="diff.water >= 0 ? 'up' : 'down'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline :points="diff.water >= 0 ? '5 12 12 5 19 12' : '5 12 12 19 19 12'"/>
                  </svg>
                  {{ Math.abs(diff.water).toFixed(1) }} m³
                </div>
                <div class="compare-sub">{{ parseFloat(previous.water_usage).toFixed(1) }} → {{ parseFloat(current.water_usage).toFixed(1) }}</div>
              </div>
              -->

              <!-- Cost diff -->
              <div class="compare-box">
                <div class="compare-label">ការផ្លាស់ប្តូរចំណាយ</div>
                <div class="compare-val" :class="diff.cost >= 0 ? 'up' : 'down'">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline :points="diff.cost >= 0 ? '5 12 12 5 19 12' : '5 12 12 19 19 12'"/>
                  </svg>
                  {{ formatKHR(Math.abs(diff.cost)) }} ៛
                </div>
                <div class="compare-sub">{{ formatKHR(previous.total_cost) }} → {{ formatKHR(current.total_cost) }} ៛</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════ Image Modal ══════ -->
    <div class="modal fade" id="imageModal" tabindex="-1" ref="imageModal">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-head">
            <h3>រូបភាពម៉ែត្រ</h3>
            <button class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body" style="text-align:center;padding:2rem">
            <img :src="currentImage" style="max-width:400px;width:100%;border-radius:12px;border:0.5px solid rgba(99,180,255,.15)" />
          </div>
        </div>
      </div>
    </div>

    <!-- ══════ Delete Modal ══════ -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModalEl">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-head danger">
            <h3>បញ្ជាក់ការលុប</h3>
            <button class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="delete-msg">តើអ្នកពិតជាចង់លុបកំណត់ត្រានេះ?</p>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" data-bs-dismiss="modal">បោះបង់</button>
            <button class="btn-danger" @click="doDelete" :disabled="isDeleting">
              <span v-if="isDeleting" class="spinner sm"></span>
              លុប
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════ Edit Modal ══════ -->
    <div class="modal fade" id="editModal" tabindex="-1" ref="editModalEl">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-head">
            <h3>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              កែប្រែកំណត់ត្រា
            </h3>
            <button class="modal-close" data-bs-dismiss="modal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">

            <!-- Edit tabs — water tab commented out
            <div class="tabs">
              <button class="tab elec" :class="{ active: editTab === 'electric' }" @click="editTab = 'electric'">អគ្គិសនី</button>
              <button class="tab water" :class="{ active: editTab === 'water' }" @click="editTab = 'water'">ទឹក</button>
              <button class="tab both" :class="{ active: editTab === 'both' }" @click="editTab = 'both'">ទាំងពីរ</button>
            </div>
            -->

            <div class="form-grid">

              <!-- Electric Section -->
              <!-- v-if="editTab === 'electric' || editTab === 'both'" — tabs removed, always show -->
              <div class="section-label elec">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                អគ្គិសនី
              </div>
              <div class="field">
                <label>លេខចាស់ (kWh)</label>
                <input :value="parseFloat(editForm.old_electric).toFixed(1)" type="number" readonly class="readonly" />
              </div>
              <div class="field">
                <label>លេខថ្មី (kWh) <span class="required">*</span></label>
                <input
                  :value="editForm.new_electric !== null && editForm.new_electric !== undefined ? parseFloat(editForm.new_electric).toFixed(1) : '0.0'"
                  @input="editForm.new_electric = parseFloat($event.target.value)"
                  type="number" step="0.1" min="0"
                />
              </div>
              <div class="field">
                <label>តម្លៃក្នុង kWh (៛)</label>
                <input
                  :value="editForm.electric_price !== null && editForm.electric_price !== undefined ? parseFloat(editForm.electric_price).toFixed(1) : '0.0'"
                  @input="editForm.electric_price = parseFloat($event.target.value)"
                  type="number" step="0.1" min="0"
                />
              </div>

              <div class="col-full" v-if="editElectricPreview.usage >= 0">
                <div class="preview-box elec">
                  ការប្រើប្រាស់: <strong>{{ (parseFloat(editElectricPreview.usage) || 0).toFixed(1) }} kWh</strong>
                  × {{ formatKHR(editForm.electric_price) }} ៛ =
                  <strong class="preview-total elec">{{ formatKHR(editElectricPreview.total || 0) }} ៛</strong>
                </div>
              </div>

              <div class="col-full">
                <label class="field-label-sm">រូបភាពម៉ែត្រអគ្គិសនី</label>
                <div class="upload-box elec">
                  <input type="file" accept="image/*" @change="onEditFileChange($event, 'electric')" class="file-input" />
                  <div v-if="editPreviews.electric" class="upload-preview">
                    <img :src="editPreviews.electric" class="meter-img" />
                    <div class="ai-scan-panel">
                      <button v-if="!aiState.electric.loading && aiState.electric.value === null && !aiState.electric.error"
                        type="button" class="ai-scan-btn elec" @click="runAIScan('electric', 'edit')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                        AI អានលេខ
                      </button>
                      <div v-if="aiState.electric.loading" class="ai-loading">
                        <div class="ai-pulse elec"></div><span>AI កំពុងស្កែន...</span>
                      </div>
                      <div v-if="aiState.electric.value !== null && !aiState.electric.loading" class="ai-result elec">
                        <div class="ai-result-label">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          AI បានរកឃើញ
                        </div>
                        <div class="ai-result-value">{{ aiState.electric.value }} <span class="ai-result-unit">kWh</span></div>
                        <div class="ai-result-actions">
                          <button type="button" class="ai-action apply" @click="editForm.new_electric = aiState.electric.value">✓ ប្រើលេខនេះ</button>
                          <button type="button" class="ai-action retry" @click="aiState.electric = { loading: false, value: null, error: null }; runAIScan('electric', 'edit')">↺ ម្ដងទៀត</button>
                        </div>
                      </div>
                      <div v-if="aiState.electric.error && !aiState.electric.loading" class="ai-error">
                        {{ aiState.electric.error }}
                        <button type="button" class="ai-action retry mt-1" @click="aiState.electric.error = null; runAIScan('electric', 'edit')">↺ ព្យាយាមម្ដងទៀត</button>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="editTarget?.electric_image" class="mt-2">
                    <div>

                      <span class="meter-img-label">រូបភាពបច្ចុប្បន្ន</span>
                    </div>
                    <div>

                      <img :src="getImageUrl(editTarget.electric_image)" class="meter-img" style="margin-top:6px" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Water edit section — commented out, not needed for now
              <div class="divider"></div>
              <div class="section-label water">ទឹក</div>
              <div class="field">
                <label>លេខចាស់ (m³)</label>
                <input :value="parseFloat(editForm.old_water).toFixed(1)" type="number" readonly class="readonly" />
              </div>
              <div class="field">
                <label>លេខថ្មី (m³) <span class="required">*</span></label>
                <input
                  :value="editForm.new_water !== null && editForm.new_water !== undefined ? parseFloat(editForm.new_water).toFixed(1) : '0.0'"
                  @input="editForm.new_water = parseFloat($event.target.value)"
                  type="number" step="0.1" min="0"
                />
              </div>
              <div class="field">
                <label>តម្លៃក្នុង m³ (៛)</label>
                <input
                  :value="editForm.water_price !== null && editForm.water_price !== undefined ? parseFloat(editForm.water_price).toFixed(1) : '0.0'"
                  @input="editForm.water_price = parseFloat($event.target.value)"
                  type="number" step="0.1" min="0"
                />
              </div>
              <div class="col-full" v-if="editWaterPreview.usage >= 0">
                <div class="preview-box water">
                  ការប្រើប្រាស់: <strong>{{ (parseFloat(editWaterPreview.usage) || 0).toFixed(1) }} m³</strong>
                  × {{ formatKHR(editForm.water_price) }} ៛ =
                  <strong class="preview-total water">{{ formatKHR(editWaterPreview.total || 0) }} ៛</strong>
                </div>
              </div>
              <div class="col-full">
                <label class="field-label-sm">រូបភាពម៉ែត្រទឹក</label>
                <div class="upload-box water">
                  <input type="file" accept="image/*" @change="onEditFileChange($event, 'water')" class="file-input" />
                  <div v-if="editPreviews.water" class="upload-preview">
                    <img :src="editPreviews.water" class="meter-img" />
                    <div class="ai-scan-panel">
                      <button v-if="!aiState.water.loading && aiState.water.value === null && !aiState.water.error"
                        type="button" class="ai-scan-btn water" @click="runAIScan('water', 'edit')">AI អានលេខ</button>
                      <div v-if="aiState.water.loading" class="ai-loading">
                        <div class="ai-pulse water"></div><span>AI កំពុងស្កែន...</span>
                      </div>
                      <div v-if="aiState.water.value !== null && !aiState.water.loading" class="ai-result water">
                        <div class="ai-result-label">AI បានរកឃើញ</div>
                        <div class="ai-result-value">{{ aiState.water.value }} <span class="ai-result-unit">m³</span></div>
                        <div class="ai-result-actions">
                          <button type="button" class="ai-action apply" @click="editForm.new_water = aiState.water.value">✓ ប្រើលេខនេះ</button>
                          <button type="button" class="ai-action retry" @click="aiState.water = { loading: false, value: null, error: null }; runAIScan('water', 'edit')">↺ ម្ដងទៀត</button>
                        </div>
                      </div>
                      <div v-if="aiState.water.error && !aiState.water.loading" class="ai-error">
                        {{ aiState.water.error }}
                        <button type="button" class="ai-action retry mt-1" @click="aiState.water.error = null; runAIScan('water', 'edit')">↺ ព្យាយាមម្ដងទៀត</button>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="editTarget?.water_image" class="mt-2">
                    <span class="meter-img-label">រូបភាពបច្ចុប្បន្ន</span>
                    <img :src="getImageUrl(editTarget.water_image)" class="meter-img" style="margin-top:6px" />
                  </div>
                </div>
              </div>
              -->

            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" data-bs-dismiss="modal">បោះបង់</button>
            <button class="btn-primary" @click="doEdit" :disabled="isEditing">
              <span v-if="isEditing" class="spinner sm"></span>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              រក្សាទុក
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  getRooms,
  getRecordsByRoom,
  getImageUrl as imgUrl,
  deleteRecord,
  patchRecord,
} from "../services/api.js";
import { useInvoice } from "../composables/useInvoice.js";
import { useToast } from "../composables/useToast.js";
import { scanMeterImage } from "../services/meterAI.js";
import { useTelegram } from "../composables/useTelegram.js";

const { sendInvoice, isSending, telegramError } = useTelegram();

const route  = useRoute();
const roomId = route.params.id;

const loading        = ref(true);
const records        = ref([]);
const roomName       = ref("");
const tenantName     = ref("—");
const imageModal     = ref(null);
const currentImage   = ref("");
const payDate        = ref("");
const expiredDate    = ref("");
const deleteModalEl  = ref(null);
const deleteTargetId = ref(null);
const isDeleting     = ref(false);
const files          = ref({ electric: null /*, water: null */ });
let _deleteModal     = null;

const toast = useToast();
const { generateInvoice, isGenerating, error: invoiceError } = useInvoice();

const current  = computed(() => records.value[0] || null);
const previous = computed(() => records.value[1] || null);

const handleSendTelegram = async () => {
  if (!current.value) return;
  try {
    await sendInvoice({
      record:      current.value,
      roomName:    roomName.value,
      tenantName:  tenantName.value,
      payDate:     payDate.value,      // ✅ raw "2026-04-04"
      expiredDate: expiredDate.value,  // ✅ raw "2026-04-22"
    });
    toast.success("ផ្ញើទៅ Telegram ដោយជោគជ័យ!");
  } catch (e) {
    toast.error(telegramError.value || "មិនអាចផ្ញើទៅ Telegram បាន។");
  }
};

const diff = computed(() => {
  if (!current.value || !previous.value) return {};
  return {
    electric: current.value.electric_usage - previous.value.electric_usage,
    // water: current.value.water_usage - previous.value.water_usage, // water — commented out
    cost: current.value.total_cost - previous.value.total_cost,
  };
});

const aiState = ref({
  electric: { loading: false, value: null, error: null },
  // water: { loading: false, value: null, error: null }, // water — commented out
});

// ─── AI Scan ───────────────────────────────────────────────
const runAIScan = async (type, fileSource = "add") => {
  const file = fileSource === "edit" ? editFiles.value[type] : files.value[type];
  if (!file) return;
  aiState.value[type] = { loading: true, value: null, error: null };
  try {
    const detected = await scanMeterImage(file, type);
    aiState.value[type].value = detected;
    if (detected !== null) {
      if (fileSource === "edit") {
        if (type === "electric") editForm.value.new_electric = detected;
        // if (type === "water") editForm.value.new_water = detected; // water — commented out
      } else {
        if (type === "electric") form.value.new_electric = detected;
        // if (type === "water") form.value.new_water = detected; // water — commented out
      }
    }
  } catch (e) {
    aiState.value[type].error = e.message;
  } finally {
    aiState.value[type].loading = false;
  }
};

// ─── Delete ────────────────────────────────────────────────
const confirmDelete = (recordId) => {
  deleteTargetId.value = recordId;
  _deleteModal = _deleteModal ?? new bootstrap.Modal(deleteModalEl.value);
  _deleteModal.show();
};

const doDelete = async () => {
  if (!deleteTargetId.value) return;
  isDeleting.value = true;
  try {
    await deleteRecord(deleteTargetId.value);
    records.value = records.value.filter((r) => r.id !== deleteTargetId.value);
    _deleteModal.hide();
    toast.success("លុបកំណត់ត្រាដោយជោគជ័យ!");
  } catch (e) {
    toast.error("មិនអាចលុបកំណត់ត្រាបាន។");
  } finally {
    isDeleting.value   = false;
    deleteTargetId.value = null;
  }
};

// ─── Helpers ───────────────────────────────────────────────
const formatKHR  = (n) => Number(n || 0).toLocaleString("km-KH");
const getImageUrl = (url) => imgUrl(url);

const showImageModal = (url) => {
  currentImage.value = imgUrl(url);
  new bootstrap.Modal(imageModal.value).show();
};

// ─── Invoice ───────────────────────────────────────────────
const handleDownloadInvoice = async () => {
  if (!current.value) return;
  try {
    await generateInvoice({
      record: current.value,
      roomName: roomName.value,
      tenantName: tenantName.value,
      payDate: payDate.value
        ? new Date(payDate.value).toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" })
        : "",
      expiredDate: expiredDate.value
        ? new Date(expiredDate.value).toLocaleDateString("km-KH", { year: "numeric", month: "long", day: "numeric" })
        : "",
    });
    toast.success("បង្កើតវិក្កយបត្រដោយជោគជ័យ!");
  } catch (e) {
    toast.error(invoiceError.value || "មិនអាចបង្កើតវិក្កយបត្របាន។");
  }
};

// ─── Edit ──────────────────────────────────────────────────
const editModalEl  = ref(null);
const editTarget   = ref(null);
// const editTab   = ref("both"); // tabs removed — always electric only
const isEditing    = ref(false);
const editPreviews = ref({ electric: null /*, water: null */ });
const editFiles    = ref({ electric: null /*, water: null */ });
let _editModal     = null;

const editForm = ref({
  old_electric:   0,
  new_electric:   0,
  electric_price: 0,
  // old_water:   0,    // water — commented out
  // new_water:   0,    // water — commented out
  // water_price: 0,    // water — commented out
});

const editElectricPreview = computed(() => {
  const usage = parseFloat(editForm.value.new_electric || 0) - parseFloat(editForm.value.old_electric || 0);
  return { usage: usage.toFixed(2), total: usage * parseFloat(editForm.value.electric_price || 0) };
});

// Water preview — commented out
// const editWaterPreview = computed(() => {
//   const usage = parseFloat(editForm.value.new_water || 0) - parseFloat(editForm.value.old_water || 0);
//   return { usage: usage.toFixed(2), total: usage * parseFloat(editForm.value.water_price || 0) };
// });

const openEdit = (record) => {
  editTarget.value   = record;
  editPreviews.value = { electric: null /*, water: null */ };
  editFiles.value    = { electric: null /*, water: null */ };
  editForm.value = {
    old_electric:   record.old_electric,
    new_electric:   record.new_electric,
    electric_price: record.electric_price,
    // old_water:   record.old_water,    // water — commented out
    // new_water:   record.new_water,    // water — commented out
    // water_price: record.water_price,  // water — commented out
  };
  _editModal = _editModal ?? new bootstrap.Modal(editModalEl.value);
  _editModal.show();
};

const onEditFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;
  editFiles.value[type]    = file;
  editPreviews.value[type] = URL.createObjectURL(file);
};

const doEdit = async () => {
  isEditing.value = true;
  try {
    const fd = new FormData();
    fd.append("type", "electric"); // only electric
    fd.append("new_electric",   editForm.value.new_electric);
    fd.append("electric_price", editForm.value.electric_price);
    if (editFiles.value.electric) fd.append("electric_image", editFiles.value.electric);

    // Water fields — commented out
    // fd.append("new_water",   editForm.value.new_water);
    // fd.append("water_price", editForm.value.water_price);
    // if (editFiles.value.water) fd.append("water_image", editFiles.value.water);

    await patchRecord(editTarget.value.id, fd);

    const idx = records.value.findIndex((r) => r.id === editTarget.value.id);
    if (idx !== -1) {
      const r = records.value[idx];
      const updated = {
        ...r,
        new_electric:   editForm.value.new_electric,
        electric_price: editForm.value.electric_price,
        electric_usage: editForm.value.new_electric - r.old_electric,
        electric_total: (editForm.value.new_electric - r.old_electric) * editForm.value.electric_price,
        // water fields unchanged — water — commented out
      };
      updated.total_cost = updated.electric_total; // + updated.water_total when water re-enabled
      records.value[idx] = updated;
    }

    _editModal.hide();
    toast.success("កែប្រែកំណត់ត្រាដោយជោគជ័យ!");
  } catch (e) {
    toast.error(e.response?.data?.message || "មិនអាចកែប្រែកំណត់ត្រាបាន។");
  } finally {
    isEditing.value = false;
  }
};

// ─── Init ──────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [roomsRes, recordsRes] = await Promise.all([
      getRooms(),
      getRecordsByRoom(roomId),
    ]);
    const room = roomsRes.data.data.find((r) => r.id == roomId);
    if (room) {
      roomName.value   = room.name;
      tenantName.value = room.tenant_name || "—";
    }
    records.value = recordsRes.data.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* ── Page ── */
.page {
  padding: 2rem 0;
  max-width: 1440px;
  margin: 0 auto;
  font-family: 'Outfit', 'Segoe UI', sans-serif;
  color: #d0e4ff;
}

/* ── Back Button ── */
.back-row { margin-bottom: 1.25rem; }
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: transparent;
  color: rgba(150, 190, 255, 0.6);
  border: 0.5px solid rgba(99, 180, 255, 0.15);
  border-radius: 9px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}
.back-btn:hover { background: rgba(99, 180, 255, 0.07); color: #d0e4ff; }

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 0;
  gap: 14px;
  color: rgba(180, 210, 255, 0.35);
  font-size: 14px;
}

/* ── Spinner ── */
.spinner {
  width: 30px; height: 30px;
  border: 2px solid rgba(99, 180, 255, 0.12);
  border-top-color: #4aadff;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
.spinner.sm { width: 14px; height: 14px; border-width: 1.5px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Room Header ── */
.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1.25rem;
}
.room-header-name {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 18px;
  font-weight: 600;
  color: #d0e4ff;
  margin-bottom: 5px;
}
.room-header-name svg { color: #4aadff; }
.room-header-tenant {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(150, 190, 255, 0.5);
}
.room-header-tenant strong { color: rgba(210, 230, 255, 0.85); }

/* ── Notice ── */
.notice-info {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 16px;
  background: rgba(74, 173, 255, 0.08);
  border: 0.5px solid rgba(74, 173, 255, 0.2);
  border-radius: 10px;
  font-size: 13px;
  color: rgba(180, 220, 255, 0.75);
}
.notice-info svg { color: #4aadff; flex-shrink: 0; }
.notice-link { color: #4aadff; text-decoration: none; margin-left: 4px; }
.notice-link:hover { text-decoration: underline; }

/* ── Card ── */
.card {
  background: #111e33;
  border: 0.5px solid rgba(99, 180, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
}
.mb { margin-bottom: 1.25rem; }

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  background: rgba(26, 79, 160, 0.35);
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.15);
}
.card-head.secondary {
  background: rgba(99, 180, 255, 0.05);
  border-bottom-color: rgba(99, 180, 255, 0.08);
}
.card-head-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #d0e4ff;
}
.card-head-actions { display: flex; gap: 8px; }

.card-body { padding: 1.25rem; }

/* ── Action Buttons ── */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 0.5px solid transparent;
  background: transparent;
  font-family: inherit;
  transition: all 0.15s;
}
.action-btn.edit {
  color: rgba(250, 190, 60, 0.8);
  background: rgba(250, 190, 60, 0.08);
  border-color: rgba(250, 190, 60, 0.2);
}
.action-btn.edit:hover { background: rgba(250, 190, 60, 0.16); color: #fabd3c; }
.action-btn.delete {
  color: rgba(255, 100, 100, 0.8);
  background: rgba(255, 100, 100, 0.08);
  border-color: rgba(255, 100, 100, 0.2);
}
.action-btn.delete:hover { background: rgba(255, 100, 100, 0.16); color: #ff7070; }

/* ── Usage Grid ── */
.usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 1rem;
}
.usage-section {
  border-radius: 12px;
  padding: 14px;
}
.usage-section.elec {
  background: rgba(251, 191, 36, 0.05);
  border: 0.5px solid rgba(251, 191, 36, 0.12);
}
.usage-section.water {
  background: rgba(74, 173, 255, 0.05);
  border: 0.5px solid rgba(74, 173, 255, 0.12);
}
.usage-section.muted {
  background: rgba(99, 180, 255, 0.03);
  border-color: rgba(99, 180, 255, 0.08);
}
.usage-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}
.usage-section-title.elec { color: #fbbf24; }
.usage-section-title.water { color: #4aadff; }
.usage-table { display: flex; flex-direction: column; gap: 2px; }
.usage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 0.5px solid rgba(99, 180, 255, 0.06);
  font-size: 13px;
}
.usage-row:last-child { border-bottom: none; }
.usage-row.highlight { background: rgba(255,255,255,.02); border-radius: 6px; padding: 5px 6px; }
.usage-row.total { margin-top: 4px; padding-top: 8px; border-top: 0.5px solid rgba(99,180,255,.1); border-bottom: none; }
.usage-lbl { color: rgba(150, 190, 255, 0.45); }
.usage-val { color: rgba(210, 230, 255, 0.85); font-weight: 500; }
.usage-val.elec  { color: #fbbf24; }
.usage-val.water { color: #4aadff; }

/* ── Meter Images ── */
.meter-imgs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.meter-img-wrap { display: flex; flex-direction: column; gap: 4px; }
.meter-img-label { font-size: 11px; color: rgba(150,190,255,.35); }
.meter-img {
  max-height: 160px;
  max-width: 200px;
  object-fit: contain;
  border-radius: 9px;
  border: 0.5px solid rgba(99,180,255,.15);
  cursor: pointer;
  transition: border-color 0.15s;
}
.meter-img:hover { border-color: rgba(99,180,255,.4); }

/* ── Total Cost ── */
.total-cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(248, 113, 113, 0.08);
  border: 0.5px solid rgba(248, 113, 113, 0.2);
  border-radius: 10px;
  margin-bottom: 1rem;
}
.total-cost-label { font-size: 14px; font-weight: 600; color: rgba(210,230,255,.8); }
.total-cost-amount { font-size: 18px; font-weight: 700; color: #f87171; }

/* ── Invoice Row ── */
.invoice-row {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
}
.date-fields { display: flex; gap: 12px; flex-wrap: wrap; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label, .field-label { font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
.field-label.red   { color: #f87171; }
.field-label.amber { color: #fbbf24; }
.field input {
  padding: 7px 11px;
  background: rgba(255,255,255,.04);
  border: 0.5px solid rgba(99,180,255,.15);
  border-radius: 9px;
  color: #d0e4ff;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  width: 160px;
}
.field input:focus { border-color: rgba(99,180,255,.4); background: rgba(99,180,255,.05); }

/* ── Previous Total ── */
.prev-total {
  text-align: right;
  font-size: 13px;
  color: rgba(150, 190, 255, 0.4);
  margin-top: 8px;
}
.prev-total strong { color: rgba(210,230,255,.7); }

/* ── Comparison ── */
.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  text-align: center;
}
.compare-box {
  background: rgba(99,180,255,.04);
  border: 0.5px solid rgba(99,180,255,.1);
  border-radius: 12px;
  padding: 16px 12px;
}
.compare-label { font-size: 11px; color: rgba(150,190,255,.4); margin-bottom: 8px; }
.compare-val {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}
.compare-val.up   { color: #f87171; }
.compare-val.down { color: #4ade80; }
.compare-sub { font-size: 11px; color: rgba(150,190,255,.35); }

/* ── Buttons ── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #1a4fa0;
  color: #fff;
  border: 0.5px solid rgba(99,180,255,.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  transition: all 0.18s;
}
.btn-primary:hover { background: #2563b8; }
.btn-primary:disabled { opacity: .45; cursor: not-allowed; }

.btn-ghost {
  padding: 9px 16px;
  background: transparent;
  color: rgba(200,220,255,.6);
  border: 0.5px solid rgba(255,255,255,.1);
  border-radius: 9px;
  font-size: 13.5px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}
.btn-ghost:hover { background: rgba(255,255,255,.05); color: #fff; }

.btn-danger {
  padding: 9px 18px;
  background: rgba(180,40,40,.6);
  color: #ffbcbc;
  border: 0.5px solid rgba(255,100,100,.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}
.btn-danger:hover { background: rgba(200,50,50,.8); }
.btn-danger:disabled { opacity: .45; cursor: not-allowed; }

.btn-success {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: rgba(74,222,128,.15);
  color: #4ade80;
  border: 0.5px solid rgba(74,222,128,.25);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}

.btn-success:hover { background: rgba(74,222,128,.25); }
.btn-success:disabled { opacity: .45; cursor: not-allowed; }

.btn-telegram {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: rgba(34, 158, 217, 0.15); /* light telegram blue */
  color: #229ED9; /* telegram blue */
  border: 0.5px solid rgba(34, 158, 217, 0.25);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;
}

/* ── Modal ── */
:deep(.modal-content) {
  background: #111e33;
  border: 0.5px solid rgba(99,180,255,.15);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0,0,0,.6);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 0.5px solid rgba(99,180,255,.1);
}
.modal-head h3 { font-size: 15px; font-weight: 600; color: #d0e4ff; margin: 0; display: flex; align-items: center; gap: 8px; }
.modal-head.danger { background: rgba(160,30,30,.25); border-bottom-color: rgba(255,80,80,.15); border-radius: 16px 16px 0 0; }
.modal-head.danger h3 { color: #ffbcbc; }
.modal-close {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 7px; background: transparent; border: none;
  color: rgba(200,220,255,.4); cursor: pointer; transition: all .15s;
}
.modal-close:hover { background: rgba(255,255,255,.07); color: #fff; }
.modal-body { padding: 1.25rem; }
.modal-foot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 1rem 1.25rem;
  border-top: 0.5px solid rgba(99,180,255,.1);
}
.delete-msg { font-size: 14px; color: rgba(210,230,255,.7); line-height: 1.6; margin: 0; }

/* ── Form Grid (edit modal) ── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.col-full { grid-column: 1 / -1; }
.divider { grid-column: 1 / -1; height: 0.5px; background: rgba(99,180,255,.1); }
.section-label {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}
.section-label.elec  { color: #fbbf24; }
.section-label.water { color: #4aadff; }

.field label {
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(150,190,255,.55);
  text-transform: uppercase;
  letter-spacing: .06em;
}
.field-label-sm {
  display: block;
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(150,190,255,.55);
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 6px;
}
.field input {
  padding: 9px 12px;
  background: rgba(255,255,255,.04);
  border: 0.5px solid rgba(99,180,255,.15);
  border-radius: 9px;
  color: #d0e4ff;
  font-size: 13.5px;
  font-family: inherit;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color .15s, background .15s;
}
.field input:focus { border-color: rgba(99,180,255,.4); background: rgba(99,180,255,.05); }
.field input.readonly { color: rgba(150,190,255,.4); cursor: default; }
.required { color: #f87171; }

/* ── Preview Box ── */
.preview-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(210,230,255,.7);
  flex-wrap: wrap;
}
.preview-box.elec  { background: rgba(251,191,36,.07); border: 0.5px solid rgba(251,191,36,.15); }
.preview-box.water { background: rgba(74,173,255,.07); border: 0.5px solid rgba(74,173,255,.15); }
.preview-box strong { color: rgba(210,230,255,.9); }
.preview-total.elec  { color: #fbbf24; }
.preview-total.water { color: #4aadff; }

/* ── Upload Box ── */
.upload-box {
  padding: 14px;
  border-radius: 12px;
  border: 0.5px solid rgba(99,180,255,.12);
}
.upload-box.elec  { background: rgba(251,191,36,.04); border-color: rgba(251,191,36,.12); }
.upload-box.water { background: rgba(74,173,255,.04); border-color: rgba(74,173,255,.12); }
.file-input {
  width: 100%;
  padding: 7px 10px;
  background: rgba(255,255,255,.04);
  border: 0.5px solid rgba(99,180,255,.15);
  border-radius: 9px;
  color: rgba(180,210,255,.7);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  box-sizing: border-box;
}
.upload-preview { display: flex; align-items: flex-start; gap: 14px; margin-top: 12px; flex-wrap: wrap; }
.mt-2 { margin-top: 8px; }

/* ── AI Scan ── */
.ai-scan-panel { display: flex; flex-direction: column; gap: 8px; min-width: 160px; }
.ai-scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all .18s;
}
.ai-scan-btn.elec  { background: rgba(251,191,36,.2); color: #fbbf24; border: 0.5px solid rgba(251,191,36,.3); }
.ai-scan-btn.elec:hover  { background: rgba(251,191,36,.3); }
.ai-scan-btn.water { background: rgba(74,173,255,.2); color: #4aadff; border: 0.5px solid rgba(74,173,255,.3); }
.ai-scan-btn.water:hover { background: rgba(74,173,255,.3); }
.ai-loading { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0; font-size: 12px; color: rgba(150,190,255,.5); }
.ai-pulse {
  width: 100px; height: 3px; border-radius: 2px;
  animation: pulse-scan 1.4s ease-in-out infinite;
  background-size: 200% 100%;
}
.ai-pulse.elec  { background: linear-gradient(90deg, rgba(251,191,36,.1), #fbbf24, rgba(251,191,36,.1)); background-size: 200% 100%; }
.ai-pulse.water { background: linear-gradient(90deg, rgba(74,173,255,.1), #4aadff, rgba(74,173,255,.1)); background-size: 200% 100%; }
@keyframes pulse-scan { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.ai-result { border-radius: 12px; padding: 12px 14px; animation: fadeIn .25s ease; }
.ai-result.elec  { background: rgba(251,191,36,.08); border: 0.5px solid rgba(251,191,36,.2); }
.ai-result.water { background: rgba(74,173,255,.08); border: 0.5px solid rgba(74,173,255,.2); }
.ai-result-label { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #4ade80; margin-bottom: 6px; }
.ai-result-value { font-size: 26px; font-weight: 800; color: #d0e4ff; line-height: 1; margin-bottom: 10px; }
.ai-result-unit { font-size: 13px; font-weight: 500; color: rgba(150,190,255,.4); margin-left: 3px; }
.ai-result-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.ai-action {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 7px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.ai-action.apply { background: rgba(74,222,128,.2); color: #4ade80; border: 0.5px solid rgba(74,222,128,.3); }
.ai-action.apply:hover { background: rgba(74,222,128,.3); }
.ai-action.retry { background: rgba(255,255,255,.05); color: rgba(150,190,255,.5); border: 0.5px solid rgba(99,180,255,.12); }
.ai-action.retry:hover { background: rgba(255,255,255,.09); }
.mt-1 { margin-top: 4px; }
.ai-error { display: flex; flex-direction: column; gap: 5px; padding: 10px 12px; border-radius: 10px; background: rgba(248,113,113,.08); border: 0.5px solid rgba(248,113,113,.2); color: #f87171; font-size: 12px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* ── Responsive ── */
@media (max-width: 640px) {
  .page { padding: 1rem; }
  .form-grid { grid-template-columns: 1fr; }
  .col-full { grid-column: 1; }
  .compare-grid { grid-template-columns: 1fr; }
}
</style>