<template>
  <div>
    <!-- Back Button -->
    <div class="mb-3">
      <router-link to="/rooms" class="btn btn-sm btn-outline-secondary">
        <i class="bi bi-arrow-left me-1"></i>ត្រឡប់ទៅបន្ទប់
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">កំពុងផ្ទុកព័ត៌មានបន្ទប់...</p>
    </div>

    <div v-else>
      <!-- Room Header -->
      <div class="card shadow-sm border-0 mb-4">
        <div
          class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3"
        >
          <div>
            <h3 class="mb-1">
              <i class="bi bi-door-open me-2 text-primary"></i>{{ roomName }}
            </h3>
            <p class="mb-0 text-muted">
              <i class="bi bi-person me-1"></i>
              អ្នកជួល: <strong>{{ tenantName }}</strong>
            </p>
          </div>
          <router-link
            :to="`/rooms/${roomId}/add-record`"
            class="btn btn-primary"
          >
            <i class="bi bi-plus-lg me-1"></i>បន្ថែមកំណត់ត្រាប្រចាំខែ
          </router-link>
        </div>
      </div>

      <!-- No records -->
      <div v-if="records.length === 0" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i
        >រកមិនឃើញកំណត់ត្រាប្រចាំខែសម្រាប់បន្ទប់នេះ។
        <router-link :to="`/rooms/${roomId}/add-record`" class="alert-link ms-1"
          >បន្ថែមកំណត់ត្រាដំបូង។</router-link
        >
      </div>

      <div v-else>
        <!-- Current Month Card -->
        <div v-if="current" class="card shadow-sm border-0 mb-4">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i class="bi bi-calendar-check me-2"></i>កំណត់ត្រាថ្មីៗ —
              {{ current.month + "/" + current.day }}
            </span>
            <div class="d-flex gap-2">
              <!-- Current card -->
              <button
                class="btn btn-sm btn-light text-primary"
                @click="openEdit(current)"
              >
                <i class="bi bi-pencil-fill me-1"></i>កែប្រែ
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="confirmDelete(current.id)"
              >
                <i class="bi bi-trash-fill me-1"></i>លុប
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <!-- Electric -->
              <div v-if="current.electric_total > 0" class="col-md-6">
                <div class="border rounded p-3">
                  <h6 class="text-warning mb-3">
                    <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">លេខចាស់</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.old_electric).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">លេខថ្មី</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.new_electric).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td class="fw-bold text-warning">
                        {{ parseFloat(current.electric_usage).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">តម្លៃក្នុង kWh</td>
                      <td>{{ formatKHR(current.electric_price) }} ៛</td>
                    </tr>
                    <tr class="table-warning">
                      <td class="fw-bold">សរុប</td>
                      <td class="fw-bold">
                        {{ formatKHR(current.electric_total) }} ៛
                      </td>
                    </tr>
                  </table>
                  <div class="row g-2 mt-3">
                    <div v-if="current.old_electric_image" class="col">
                      <small class="text-muted d-block mb-1">ខែមុន</small>
                      <img
                        :src="getImageUrl(current.old_electric_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        @click="showImageModal(current.old_electric_image)"
                      />
                    </div>
                    <div v-if="current.electric_image" class="col">
                      <small class="text-muted d-block mb-1">ខែនេះ</small>
                      <img
                        :src="getImageUrl(current.electric_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        @click="showImageModal(current.electric_image)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Water -->
              <div v-if="current.water_total > 0" class="col-md-6">
                <div class="border rounded p-3">
                  <h6 class="text-info mb-3">
                    <i class="bi bi-droplet-fill me-1"></i>ទឹក
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">លេខចាស់</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.old_water).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">លេខថ្មី</td>
                      <td class="fw-semibold">
                        {{ parseFloat(current.new_water).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td class="fw-bold text-info">
                        {{ parseFloat(current.water_usage).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">តម្លៃក្នុង m³</td>
                      <td>{{ formatKHR(current.water_price) }} ៛</td>
                    </tr>
                    <tr class="table-info">
                      <td class="fw-bold">សរុប</td>
                      <td class="fw-bold">
                        {{ formatKHR(current.water_total) }} ៛
                      </td>
                    </tr>
                  </table>
                  <div class="row g-2 mt-3">
                    <div v-if="current.old_water_image" class="col">
                      <small class="text-muted d-block mb-1">ខែមុន</small>
                      <img
                        :src="getImageUrl(current.old_water_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        @click="showImageModal(current.old_water_image)"
                      />
                    </div>
                    <div v-if="current.water_image" class="col">
                      <small class="text-muted d-block mb-1">ខែនេះ</small>
                      <img
                        :src="getImageUrl(current.water_image)"
                        class="img-thumbnail cursor-pointer w-100"
                        style="height: 200px"
                        @click="showImageModal(current.water_image)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total Cost -->
            <div
              class="alert alert-danger mt-3 mb-0 d-flex justify-content-between align-items-center"
            >
              <span class="fw-bold fs-6">ចំនួនទឹកប្រាក់សរុបត្រូវបង់</span>
              <span class="fw-bold fs-5"
                >{{ formatKHR(current.total_cost) }} ៛</span
              >
            </div>

            <!-- Action Buttons -->
            <div
              class="d-flex gap-2 justify-content-center mt-3 align-items-end flex-wrap"
            >
              <!-- Pay date + Expired date inputs -->
              <div
                class="d-flex gap-2 align-items-center me-md-auto me-0 flex-wrap"
              >
                <div>
                  <label class="form-label mb-1 small text-danger fw-semibold"
                    >កាលបរិច្ឆេទបង់ប្រាក់</label
                  >
                  <input
                    v-model="payDate"
                    type="date"
                    class="form-control form-control-sm"
                    style="width: 160px"
                  />
                </div>
                <div>
                  <label
                    class="form-label mb-1 small fw-semibold"
                    style="color: #e67e22"
                    >កាលបរិច្ឆេទផុតកំណត់</label
                  >
                  <input
                    v-model="expiredDate"
                    type="date"
                    class="form-control form-control-sm"
                    style="width: 160px"
                  />
                </div>
              </div>
              <button
                class="btn btn-success fs-6 btn-lg px-4"
                :disabled="isGenerating || !current"
                @click="handleDownloadInvoice"
              >
                <span
                  v-if="isGenerating"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i v-else class="bi bi-file-earmark-pdf me-2"></i>
                {{
                  isGenerating ? "កំពុងបង្កើត PDF..." : "ទាញយកវិក្កយបត្រ PDF"
                }}
              </button>
            </div>
          </div>
        </div>

        <!-- Previous Month Card -->
        <div v-if="previous" class="card shadow-sm border-0 mb-4">
          <div
            class="card-header bg-secondary text-white d-flex justify-content-between align-items-center"
          >
            <span>
              <i class="bi bi-calendar me-2"></i>កំណត់ត្រាមុន —
              {{ previous.month + "/" + previous.day }}
            </span>
            <div class="d-flex gap-2">
              <!-- Previous card -->
              <button
                class="btn btn-sm btn-light text-secondary"
                @click="openEdit(previous)"
              >
                <i class="bi bi-pencil-fill me-1"></i>កែប្រែ
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="confirmDelete(previous.id)"
              >
                <i class="bi bi-trash-fill me-1"></i>លុប
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-md-6">
                <div class="border rounded p-3 bg-light">
                  <h6 class="text-warning mb-2">
                    <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td>
                        {{ parseFloat(previous.electric_usage).toFixed(1) }} kWh
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">សរុប</td>
                      <td>{{ formatKHR(previous.electric_total) }} ៛</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded p-3 bg-light">
                  <h6 class="text-info mb-2">
                    <i class="bi bi-droplet-fill me-1"></i>ទឹក
                  </h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tr>
                      <td class="text-muted">ការប្រើប្រាស់</td>
                      <td>
                        {{ parseFloat(previous.water_usage).toFixed(1) }} m³
                      </td>
                    </tr>
                    <tr>
                      <td class="text-muted">សរុប</td>
                      <td>{{ formatKHR(previous.water_total) }} ៛</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
            <div class="mt-2 text-end text-muted">
              សរុបខែមុន: <strong>{{ formatKHR(previous.total_cost) }} ៛</strong>
            </div>
          </div>
        </div>

        <!-- Comparison Card -->
        <div
          v-if="current && previous"
          class="card shadow-sm border-0 border-start border-4 border-primary"
        >
          <div class="card-header bg-light">
            <i class="bi bi-bar-chart-line me-2 text-primary"></i
            >ការប្រៀបធៀបពីខែទៅខែ
          </div>
          <div class="card-body">
            <div class="row g-3 text-center">
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរការប្រើអគ្គិសនី
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.electric >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.electric >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ Math.abs(diff.electric).toFixed(1) }} kWh
                  </div>
                  <div class="small text-muted">
                    {{ parseFloat(previous.electric_usage).toFixed(1) }} →
                    {{ parseFloat(current.electric_usage).toFixed(1) }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរការប្រើទឹក
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.water >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.water >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ Math.abs(diff.water).toFixed(1) }} m³
                  </div>
                  <div class="small text-muted">
                    {{ parseFloat(previous.water_usage).toFixed(1) }} →
                    {{ parseFloat(current.water_usage).toFixed(1) }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <div class="text-muted small mb-1">
                    ការផ្លាស់ប្តូរចំណាយសរុប
                  </div>
                  <div
                    class="fs-4 fw-bold"
                    :class="diff.cost >= 0 ? 'text-danger' : 'text-success'"
                  >
                    <i
                      class="bi"
                      :class="
                        diff.cost >= 0
                          ? 'bi-arrow-up-circle-fill'
                          : 'bi-arrow-down-circle-fill'
                      "
                    ></i>
                    {{ formatKHR(Math.abs(diff.cost)) }} ៛
                  </div>
                  <div class="small text-muted">
                    {{ formatKHR(previous.total_cost) }} →
                    {{ formatKHR(current.total_cost) }} ៛
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" ref="imageModal">
          <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">រូបភាពម៉ែត្រ</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div class="modal-body text-center p-5">
                <img
                  :src="currentImage"
                  class="img-fluid"
                  style="width: 400px; object-fit: contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Confirm Delete -->
    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModalEl">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">បញ្ជាក់ការលុប</h5>
            <button
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">តើអ្នកពិតជាចង់លុបកំណត់ត្រានេះ?</div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              បោះបង់
            </button>
            <button
              class="btn btn-danger"
              @click="doDelete"
              :disabled="isDeleting"
            >
              <span
                v-if="isDeleting"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              លុប
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal: Edit Record -->
    <div class="modal fade" id="editModal" tabindex="-1" ref="editModalEl">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-pencil-fill me-2"></i>កែប្រែកំណត់ត្រា
            </h5>
            <button
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Tabs -->
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button
                  class="nav-link text-warning d-flex align-items-center gap-1"
                  :class="{ active: editTab === 'electric' }"
                  @click="editTab = 'electric'"
                >
                  <i class="bi bi-lightning-charge-fill text-warning"></i
                  >អគ្គិសនី
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link text-info d-flex align-items-center gap-1"
                  :class="{ active: editTab === 'water' }"
                  @click="editTab = 'water'"
                >
                  <i class="bi bi-droplet-fill text-info"></i>ទឹក
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link text-success d-flex align-items-center gap-1"
                  :class="{ active: editTab === 'both' }"
                  @click="editTab = 'both'"
                >
                  <i class="bi bi-collection-fill text-success"></i>ទាំងពីរ
                </button>
              </li>
            </ul>

            <div class="row g-3">
              <!-- Electric Section -->
              <template v-if="editTab === 'electric' || editTab === 'both'">
                <div class="col-12">
                  <h6 class="text-warning">
                    <i class="bi bi-lightning-charge-fill me-1"></i>អគ្គិសនី
                  </h6>
                </div>
                <div class="col-md-4">
                  <label class="form-label">លេខចាស់ (kWh)</label>
                  <input
                    :value="parseFloat(editForm.old_electric).toFixed(1)"
                    type="number"
                    class="form-control bg-light"
                    readonly
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label"
                    >លេខថ្មី (kWh) <span class="text-danger">*</span></label
                  >
                  <input
                    :value="
                      editForm.new_electric !== null &&
                      editForm.new_electric !== undefined
                        ? parseFloat(editForm.new_electric).toFixed(1)
                        : '0.0'
                    "
                    @input="
                      editForm.new_electric = parseFloat($event.target.value)
                    "
                    type="number"
                    step="0.1"
                    min="0"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">តម្លៃក្នុង kWh (៛)</label>
                  <input
                    :value="
                      editForm.electric_price !== null &&
                      editForm.electric_price !== undefined
                        ? parseFloat(editForm.electric_price).toFixed(1)
                        : '0.0'
                    "
                    @input="
                      editForm.electric_price = parseFloat($event.target.value)
                    "
                    type="number"
                    step="0.1"
                    min="0"
                    class="form-control"
                  />
                </div>
                <div class="col-12" v-if="editElectricPreview.usage >= 0">
                  <div class="bg-warning-subtle rounded p-2 small">
                    ការប្រើប្រាស់:
                    <strong
                      >{{
                        (parseFloat(editElectricPreview.usage) || 0).toFixed(1)
                      }}
                      m³</strong
                    >
                    × {{ formatKHR(editForm.electric_price) }} ៛ =
                    <strong class="text-info">
                      {{ formatKHR(editElectricPreview.total || 0) }} ៛
                    </strong>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">រូបភាពម៉ែត្រអគ្គិសនី</label>
                  <div class="border rounded p-3" style="background: #fffdf0">
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="onEditFileChange($event, 'electric')"
                    />
                    <div v-if="editPreviews.electric" class="mt-3 d-flex gap-3">
                      <img
                        :src="editPreviews.electric"
                        class="img-thumbnail"
                        style="max-height: 140px; object-fit: contain"
                      />
                      <div class="ai-scan-panel ai-scan-panel--electric">
                        <button
                          v-if="
                            !aiState.electric.loading &&
                            aiState.electric.value === null &&
                            !aiState.electric.error
                          "
                          type="button"
                          class="ai-scan-btn ai-scan-btn--electric"
                          @click="runAIScan('electric', 'edit')"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.2"
                          >
                            <path
                              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
                            />
                            <path d="M12 8v4l3 3" />
                          </svg>
                          AI អានលេខ
                        </button>
                        <div
                          v-if="aiState.electric.loading"
                          class="ai-scan-loading"
                        >
                          <div
                            class="ai-scan-pulse ai-scan-pulse--electric"
                          ></div>
                          <span>AI កំពុងស្កែន...</span>
                        </div>
                        <div
                          v-if="
                            aiState.electric.value !== null &&
                            !aiState.electric.loading
                          "
                          class="ai-scan-result ai-scan-result--electric"
                        >
                          <div class="ai-scan-result__label">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            AI បានរកឃើញ
                          </div>
                          <div class="ai-scan-result__value">
                            {{ aiState.electric.value }}
                            <span class="ai-scan-result__unit">kWh</span>
                          </div>
                          <div class="ai-scan-result__actions">
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--apply"
                              @click="
                                editForm.new_electric = aiState.electric.value
                              "
                            >
                              ✓ ប្រើលេខនេះ
                            </button>
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--retry"
                              @click="
                                aiState.electric = {
                                  loading: false,
                                  value: null,
                                  error: null,
                                };
                                runAIScan('electric', 'edit');
                              "
                            >
                              ↺ ស្កែនម្ដងទៀត
                            </button>
                          </div>
                        </div>
                        <div
                          v-if="
                            aiState.electric.error && !aiState.electric.loading
                          "
                          class="ai-scan-error"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          {{ aiState.electric.error }}
                          <button
                            type="button"
                            class="ai-action-btn ai-action-btn--retry mt-1"
                            @click="
                              aiState.electric.error = null;
                              runAIScan('electric', 'edit');
                            "
                          >
                            ↺ ព្យាយាមម្ដងទៀត
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="editTarget?.electric_image" class="mt-2">
                      <small class="text-muted d-block mb-1"
                        >រូបភាពបច្ចុប្បន្ន</small
                      >
                      <img
                        :src="getImageUrl(editTarget.electric_image)"
                        class="img-thumbnail"
                        style="max-height: 140px; object-fit: contain"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-12" v-if="editTab === 'both'">
                  <hr class="my-1" />
                </div>
              </template>

              <!-- Water Section -->
              <template v-if="editTab === 'water' || editTab === 'both'">
                <div class="col-12">
                  <h6 class="text-info">
                    <i class="bi bi-droplet-fill me-1"></i>ទឹក
                  </h6>
                </div>
                <div class="col-md-4">
                  <label class="form-label">លេខចាស់ (m³)</label>
                  <input
                    :value="parseFloat(editForm.old_water).toFixed(1)"
                    type="number"
                    class="form-control bg-light"
                    readonly
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label"
                    >លេខថ្មី (m³) <span class="text-danger">*</span></label
                  >
                  <input
                    :value="
                      editForm.new_water !== null &&
                      editForm.new_water !== undefined
                        ? parseFloat(editForm.new_water).toFixed(1)
                        : '0.0'
                    "
                    @input="
                      editForm.new_water = parseFloat($event.target.value)
                    "
                    type="number"
                    step="0.1"
                    min="0"
                    class="form-control"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">តម្លៃក្នុង m³ (៛)</label>
                  <input
                    :value="
                      editForm.water_price !== null &&
                      editForm.water_price !== undefined
                        ? parseFloat(editForm.water_price).toFixed(1)
                        : '0.0'
                    "
                    @input="
                      editForm.water_price = parseFloat($event.target.value)
                    "
                    type="number"
                    step="0.1"
                    min="0"
                    class="form-control"
                  />
                </div>
                <div class="col-12" v-if="editWaterPreview.usage >= 0">
                  <div class="bg-info-subtle rounded p-2 small">
                    ការប្រើប្រាស់:
                    <strong
                      >{{
                        (parseFloat(editWaterPreview.usage) || 0).toFixed(1)
                      }}
                      m³</strong
                    >
                    × {{ formatKHR(editForm.water_price) }} ៛ =
                    <strong class="text-info">
                      {{ formatKHR(editWaterPreview.total || 0) }} ៛
                    </strong>
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label">រូបភាពម៉ែត្រទឹក</label>
                  <div class="border rounded p-3" style="background: #f0fbff">
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="onEditFileChange($event, 'water')"
                    />
                    <div v-if="editPreviews.water" class="mt-3 d-flex gap-3">
                      <img
                        :src="editPreviews.water"
                        class="img-thumbnail"
                        style="max-height: 140px; object-fit: contain"
                      />
                      <div class="ai-scan-panel ai-scan-panel--water">
                        <button
                          v-if="
                            !aiState.water.loading &&
                            aiState.water.value === null &&
                            !aiState.water.error
                          "
                          type="button"
                          class="ai-scan-btn ai-scan-btn--water"
                          @click="runAIScan('water', 'edit')"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.2"
                          >
                            <path
                              d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"
                            />
                            <path d="M12 8v4l3 3" />
                          </svg>
                          AI អានលេខ
                        </button>
                        <div
                          v-if="aiState.water.loading"
                          class="ai-scan-loading"
                        >
                          <div class="ai-scan-pulse ai-scan-pulse--water"></div>
                          <span>AI កំពុងស្កែន...</span>
                        </div>
                        <div
                          v-if="
                            aiState.water.value !== null &&
                            !aiState.water.loading
                          "
                          class="ai-scan-result ai-scan-result--water"
                        >
                          <div class="ai-scan-result__label">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            AI បានរកឃើញ
                          </div>
                          <div class="ai-scan-result__value">
                            {{ aiState.water.value }}
                            <span class="ai-scan-result__unit">m³</span>
                          </div>
                          <div class="ai-scan-result__actions">
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--apply"
                              @click="editForm.new_water = aiState.water.value"
                            >
                              ✓ ប្រើលេខនេះ
                            </button>
                            <button
                              type="button"
                              class="ai-action-btn ai-action-btn--retry"
                              @click="
                                aiState.water = {
                                  loading: false,
                                  value: null,
                                  error: null,
                                };
                                runAIScan('water');
                              "
                            >
                              ↺ ស្កែនម្ដងទៀត
                            </button>
                          </div>
                        </div>
                        <div
                          v-if="aiState.water.error && !aiState.water.loading"
                          class="ai-scan-error"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          {{ aiState.water.error }}
                          <button
                            type="button"
                            class="ai-action-btn ai-action-btn--retry mt-1"
                            @click="
                              aiState.water.error = null;
                              runAIScan('water');
                            "
                          >
                            ↺ ព្យាយាមម្ដងទៀត
                          </button>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="editTarget?.water_image" class="mt-2">
                      <small class="text-muted d-block mb-1"
                        >រូបភាពបច្ចុប្បន្ន</small
                      >
                      <img
                        :src="getImageUrl(editTarget.water_image)"
                        class="img-thumbnail"
                        style="max-height: 140px; object-fit: contain"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              បោះបង់
            </button>
            <button
              class="btn btn-primary"
              @click="doEdit"
              :disabled="isEditing"
            >
              <span
                v-if="isEditing"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              <i v-else class="bi bi-save me-1"></i>
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
} from "../services/api.js";
import { useInvoice } from "../composables/useInvoice.js";
import { useToast } from "../composables/useToast.js";
import { scanMeterImage } from "../services/meterAI.js";

const route = useRoute();
const roomId = route.params.id;

const loading = ref(true);
const records = ref([]);
const roomName = ref("");
const tenantName = ref("—");
const imageModal = ref(null);
const currentImage = ref("");
const payDate = ref("");
const expiredDate = ref("");
const deleteModalEl = ref(null);
const deleteTargetId = ref(null);
const isDeleting = ref(false);
let _deleteModal = null;
const files = ref({ electric: null, water: null });

const toast = useToast();
const { generateInvoice, isGenerating, error: invoiceError } = useInvoice();

const current = computed(() => records.value[0] || null);
const previous = computed(() => records.value[1] || null);

const diff = computed(() => {
  if (!current.value || !previous.value) return {};
  return {
    electric: current.value.electric_usage - previous.value.electric_usage,
    water: current.value.water_usage - previous.value.water_usage,
    cost: current.value.total_cost - previous.value.total_cost,
  };
});

const aiState = ref({
  electric: { loading: false, value: null, error: null },
  water: { loading: false, value: null, error: null },
});

// ─── AI Scan ─────────────────────────────────────────────────
// Replace the existing runAIScan with this:
const runAIScan = async (type, fileSource = "add") => {
  const file =
    fileSource === "edit" ? editFiles.value[type] : files.value[type];
  if (!file) return;

  aiState.value[type] = { loading: true, value: null, error: null };
  try {
    const detected = await scanMeterImage(file, type);
    aiState.value[type].value = detected;
    if (detected !== null) {
      // Write to the correct form based on context
      if (fileSource === "edit") {
        if (type === "electric") editForm.value.new_electric = detected;
        if (type === "water") editForm.value.new_water = detected;
      } else {
        if (type === "electric") form.value.new_electric = detected;
        if (type === "water") form.value.new_water = detected;
      }
    }
  } catch (e) {
    aiState.value[type].error = e.message;
  } finally {
    aiState.value[type].loading = false;
  }
};

// Open modal
const confirmDelete = (recordId) => {
  deleteTargetId.value = recordId;
  _deleteModal = _deleteModal ?? new bootstrap.Modal(deleteModalEl.value);
  _deleteModal.show();
};

// Confirmed — do the actual delete
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
    isDeleting.value = false;
    deleteTargetId.value = null;
  }
};

const formatKHR = (n) => Number(n || 0).toLocaleString("km-KH");

const showImageModal = (url) => {
  currentImage.value = imgUrl(url);
  new bootstrap.Modal(imageModal.value).show();
};

const getImageUrl = (url) => imgUrl(url);

// ─── Generate PDF + download ────────────────────────────────
const handleDownloadInvoice = async () => {
  if (!current.value) return;
  try {
    await generateInvoice({
      record: current.value,
      roomName: roomName.value,
      tenantName: tenantName.value,
      payDate: payDate.value
        ? new Date(payDate.value).toLocaleDateString("km-KH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
      expiredDate: expiredDate.value
        ? new Date(expiredDate.value).toLocaleDateString("km-KH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    });
    toast.success("បង្កើតវិក្កយបត្រដោយជោគជ័យ!", { autoClose: 3000 });
  } catch (e) {
    toast.error(invoiceError.value || "មិនអាចបង្កើតវិក្កយបត្របាន។");
  }
};

import { patchRecord } from "../services/api.js";

const editModalEl = ref(null);
const editTarget = ref(null);
const editTab = ref("both");
const isEditing = ref(false);
const editPreviews = ref({ electric: null, water: null });
const editFiles = ref({ electric: null, water: null });
let _editModal = null;

const editForm = ref({
  old_electric: 0,
  new_electric: 0,
  electric_price: 0,
  old_water: 0,
  new_water: 0,
  water_price: 0,
});

const editElectricPreview = computed(() => {
  const usage =
    parseFloat(editForm.value.new_electric || 0) -
    parseFloat(editForm.value.old_electric || 0);
  return {
    usage: usage.toFixed(2),
    total: usage * parseFloat(editForm.value.electric_price || 0),
  };
});

const editWaterPreview = computed(() => {
  const usage =
    parseFloat(editForm.value.new_water || 0) -
    parseFloat(editForm.value.old_water || 0);
  return {
    usage: usage.toFixed(2),
    total: usage * parseFloat(editForm.value.water_price || 0),
  };
});

const openEdit = (record) => {
  editTarget.value = record;
  editTab.value = "both";
  editPreviews.value = { electric: null, water: null };
  editFiles.value = { electric: null, water: null };
  editForm.value = {
    old_electric: record.old_electric,
    new_electric: record.new_electric,
    electric_price: record.electric_price,
    old_water: record.old_water,
    new_water: record.new_water,
    water_price: record.water_price,
  };
  _editModal = _editModal ?? new bootstrap.Modal(editModalEl.value);
  _editModal.show();
};

const onEditFileChange = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;
  editFiles.value[type] = file;
  editPreviews.value[type] = URL.createObjectURL(file);
};

const doEdit = async () => {
  isEditing.value = true;
  try {
    const fd = new FormData();
    fd.append("type", editTab.value);
    if (editTab.value === "electric" || editTab.value === "both") {
      fd.append("new_electric", editForm.value.new_electric);
      fd.append("electric_price", editForm.value.electric_price);
      if (editFiles.value.electric)
        fd.append("electric_image", editFiles.value.electric);
    }
    if (editTab.value === "water" || editTab.value === "both") {
      fd.append("new_water", editForm.value.new_water);
      fd.append("water_price", editForm.value.water_price);
      if (editFiles.value.water)
        fd.append("water_image", editFiles.value.water);
    }
    await patchRecord(editTarget.value.id, fd);

    // Update local records so UI reflects changes immediately
    const idx = records.value.findIndex((r) => r.id === editTarget.value.id);
    if (idx !== -1) {
      const r = records.value[idx];
      const updated = {
        ...r,
        new_electric: editForm.value.new_electric,
        electric_price: editForm.value.electric_price,
        new_water: editForm.value.new_water,
        water_price: editForm.value.water_price,
        electric_usage: editForm.value.new_electric - r.old_electric,
        electric_total:
          (editForm.value.new_electric - r.old_electric) *
          editForm.value.electric_price,
        water_usage: editForm.value.new_water - r.old_water,
        water_total:
          (editForm.value.new_water - r.old_water) * editForm.value.water_price,
      };
      updated.total_cost = updated.electric_total + updated.water_total;
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

// ─── Init ────────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [roomsRes, recordsRes] = await Promise.all([
      getRooms(),
      getRecordsByRoom(roomId),
    ]);
    const room = roomsRes.data.data.find((r) => r.id == roomId);
    if (room) {
      roomName.value = room.name;
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
.cursor-pointer {
  cursor: pointer;
  object-fit: cover;
}
.cursor-pointer:hover {
  transform: scale(1.02);
  transition: transform 0.2s;
}
.ai-scan-panel {
  min-width: 160px;
}
.ai-scan-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 10px;
  border: none;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
.ai-scan-btn--electric {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #78350f;
}
.ai-scan-btn--water {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
  color: #0c4a6e;
}
.ai-scan-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}
.ai-scan-btn:active {
  transform: translateY(0);
}

.ai-scan-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  font-size: 0.8rem;
  color: #64748b;
}
.ai-scan-pulse {
  width: 120px;
  height: 4px;
  border-radius: 2px;
  background-size: 200% 100%;
  animation: pulse-scan 1.4s ease-in-out infinite;
}
.ai-scan-pulse--electric {
  background: linear-gradient(90deg, #fde68a, #f59e0b, #fde68a);
  background-size: 200% 100%;
}
.ai-scan-pulse--water {
  background: linear-gradient(90deg, #bae6fd, #0ea5e9, #bae6fd);
  background-size: 200% 100%;
}
@keyframes pulse-scan {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.ai-scan-result {
  border-radius: 12px;
  padding: 12px 14px;
  border: 1.5px solid;
  animation: fadeSlideIn 0.3s ease;
}
.ai-scan-result--electric {
  background: #fffbeb;
  border-color: #fde68a;
}
.ai-scan-result--water {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.ai-scan-result__label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
  color: #22c55e;
}
.ai-scan-result__value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 10px;
}
.ai-scan-result__unit {
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  margin-left: 3px;
}
.ai-scan-result__actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ai-action-btn {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;
  border-radius: 7px;
  border: none;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.ai-action-btn--apply {
  background: #22c55e;
  color: white;
}
.ai-action-btn--apply:hover {
  background: #16a34a;
}
.ai-action-btn--retry {
  background: #f1f5f9;
  color: #64748b;
}
.ai-action-btn--retry:hover {
  background: #e2e8f0;
}

.ai-scan-error {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.8rem;
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>