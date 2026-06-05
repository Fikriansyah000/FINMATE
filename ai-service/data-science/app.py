import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import os

# --- Page Configuration ---
st.set_page_config(
    page_title="FINMATE Dashboard",
    page_icon="💸",
    layout="wide",
    initial_sidebar_state="expanded",
)

# --- Custom CSS for Poppins Font ---
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

html, body, [class*="css"]  {
    font-family: 'Poppins', sans-serif;
}

.metric-card {
    background-color: #112240;
    border-left: 5px solid #4FC3F7;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.metric-title {
    color: #90A4AE;
    font-size: 14px;
    margin-bottom: 5px;
}

.metric-value {
    color: #E0E0E0;
    font-size: 24px;
    font-weight: 600;
}
</style>
""", unsafe_allow_html=True)

# --- Data Loading ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

@st.cache_data
def load_data(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        return pd.read_csv(path)
    return pd.DataFrame()

@st.cache_data
def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}

# Load aggregated data
cat_dist = load_data("category_distribution.csv")
hourly_pattern = load_data("hourly_pattern.csv")
daily_pattern = load_data("daily_pattern.csv")
monthly_pattern = load_data("monthly_pattern.csv")
cat_amt_stats = load_data("category_amount_stats.csv")
fraud_by_category = load_data("fraud_by_category.csv")
fraud_by_hour = load_data("fraud_by_hour.csv")
fraud_stats = load_data("fraud_stats.csv")
gender_dist = load_data("gender_distribution.csv")
top_merchants_fraud = load_data("top_merchants_fraud.csv")
nlp_cat_dist = load_data("nlp_category_distribution.csv")
nlp_top_words = load_data("nlp_top_words.csv")
nlp_results = load_json("nlp_model_results.json")
amt_dist = load_data("amount_distribution.csv")
state_count = load_data("state_transaction_count.csv")

# --- Sidebar Navigation ---
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/3135/3135673.png", width=100) # Placeholder logo
st.sidebar.title("FINMATE Dashboard")
page = st.sidebar.radio("Navigasi", ["🏠 Overview", "📊 Analisis Pengeluaran", "⏰ Pola Waktu & Fraud", "🤖 Performa Model NLP"])

st.sidebar.markdown("---")
st.sidebar.markdown("### Tentang FINMATE")
st.sidebar.info("Proyek Capstone ini bertujuan untuk mengategorikan transaksi dan mendeteksi pola pengeluaran serta potensi fraud.")

# --- Page 1: Overview ---
if page == "🏠 Overview":
    st.title("Ringkasan Transaksi (Overview)")
    st.markdown("Gambaran umum dari dataset transaksi kartu kredit yang diproses.")
    
    # KPI Cards
    if not fraud_stats.empty:
        col1, col2, col3, col4 = st.columns(4)
        total_txn = fraud_stats.iloc[0]['total_transactions']
        total_fraud = fraud_stats.iloc[0]['total_fraud']
        fraud_rate = fraud_stats.iloc[0]['fraud_rate'] * 100
        avg_amt = (fraud_stats.iloc[0]['avg_amount_non_fraud'] + fraud_stats.iloc[0]['avg_amount_fraud']) / 2 # Approx
        
        col1.markdown(f'<div class="metric-card"><div class="metric-title">Total Transaksi</div><div class="metric-value">{total_txn:,.0f}</div></div>', unsafe_allow_html=True)
        col2.markdown(f'<div class="metric-card"><div class="metric-title">Total Fraud</div><div class="metric-value">{total_fraud:,.0f}</div></div>', unsafe_allow_html=True)
        col3.markdown(f'<div class="metric-card"><div class="metric-title">Rata-rata Amount ($)</div><div class="metric-value">{avg_amt:,.2f}</div></div>', unsafe_allow_html=True)
        col4.markdown(f'<div class="metric-card"><div class="metric-title">Tingkat Fraud (%)</div><div class="metric-value">{fraud_rate:,.2f}%</div></div>', unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_chart1, col_chart2 = st.columns([2, 1])
    
    with col_chart1:
        st.subheader("Distribusi Kategori Transaksi")
        if not cat_dist.empty:
            fig = px.bar(cat_dist, x='category', y='count', color='count', 
                         color_continuous_scale=px.colors.sequential.Tealgrn,
                         template="plotly_dark", title="")
            fig.update_layout(xaxis_title="Kategori", yaxis_title="Jumlah Transaksi", xaxis={'categoryorder':'total descending'})
            st.plotly_chart(fig, use_container_width=True)
            
    with col_chart2:
        st.subheader("Distribusi Gender")
        if not gender_dist.empty:
            fig_gender = px.pie(gender_dist, names='gender', values='count', 
                                color_discrete_sequence=['#4FC3F7', '#FFB74D'],
                                template="plotly_dark", hole=0.4)
            st.plotly_chart(fig_gender, use_container_width=True)
            
    st.subheader("Top 10 State Berdasarkan Jumlah Transaksi")
    if not state_count.empty:
        fig_state = px.bar(state_count.sort_values('count', ascending=True), x='count', y='state', orientation='h',
                           color='count', color_continuous_scale=px.colors.sequential.Blues, template="plotly_dark")
        fig_state.update_layout(xaxis_title="Jumlah Transaksi", yaxis_title="State")
        st.plotly_chart(fig_state, use_container_width=True)

# --- Page 2: Analisis Pengeluaran ---
elif page == "📊 Analisis Pengeluaran":
    st.title("Analisis Pengeluaran (Overspending)")
    st.markdown("Menjawab Pertanyaan I: Kategori pengeluaran apa yang paling mendominasi dan pola indikasi overspending.")
    
    if not cat_dist.empty:
        st.subheader("Peta Proporsi Kategori Pengeluaran (Treemap)")
        fig_tree = px.treemap(cat_dist, path=['category'], values='count', 
                              color='count', color_continuous_scale='Blues',
                              template='plotly_dark')
        st.plotly_chart(fig_tree, use_container_width=True)
        
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Rata-rata Amount per Kategori")
        if not cat_amt_stats.empty:
            fig_amt = px.bar(cat_amt_stats.sort_values('mean', ascending=True), x='mean', y='category', orientation='h',
                             color='mean', color_continuous_scale=px.colors.sequential.Plasma, template="plotly_dark")
            fig_amt.update_layout(xaxis_title="Rata-rata Amount ($)", yaxis_title="")
            st.plotly_chart(fig_amt, use_container_width=True)
            
    with col2:
        st.subheader("Distribusi Amount Transaksi")
        if not amt_dist.empty:
            fig_dist = px.bar(amt_dist, x='amount_range', y='count', 
                              color_discrete_sequence=['#4FC3F7'], template="plotly_dark")
            fig_dist.update_layout(xaxis_title="Rentang Amount ($)", yaxis_title="Jumlah Transaksi")
            st.plotly_chart(fig_dist, use_container_width=True)
            
    st.info("💡 **Insight**: Dapat dilihat dari sebaran kategori dan nilai transaksi, beberapa kategori spesifik menunjukkan volume yang sangat tinggi, sementara kategori lain memiliki nominal rata-rata (amount) yang sangat besar per transaksinya. Hal ini dapat menjadi acuan indikasi *overspending* atau pemborosan pada kategori tertentu.")

# --- Page 3: Pola Waktu & Fraud ---
elif page == "⏰ Pola Waktu & Fraud":
    st.title("Pola Waktu & Deteksi Fraud")
    st.markdown("Menjawab Pertanyaan II: Pola waktu, frekuensi, dan hubungannya dengan deteksi aktivitas berisiko.")
    
    st.subheader("Tren Transaksi Waktu (Per Jam, Hari, Bulan)")
    tab1, tab2, tab3 = st.tabs(["Per Jam", "Per Hari", "Per Bulan"])
    
    with tab1:
        if not hourly_pattern.empty:
            fig_hour = px.line(hourly_pattern, x='hour', y='count', markers=True, 
                               color_discrete_sequence=['#00E676'], template="plotly_dark")
            fig_hour.update_layout(xaxis_title="Jam", yaxis_title="Jumlah Transaksi", xaxis=dict(dtick=1))
            st.plotly_chart(fig_hour, use_container_width=True)
            
    with tab2:
        if not daily_pattern.empty:
            fig_day = px.bar(daily_pattern, x='day', y='count', 
                             color_discrete_sequence=['#4FC3F7'], template="plotly_dark")
            fig_day.update_layout(xaxis_title="Hari", yaxis_title="Jumlah Transaksi")
            st.plotly_chart(fig_day, use_container_width=True)
            
    with tab3:
        if not monthly_pattern.empty:
            fig_month = px.line(monthly_pattern, x='month', y='count', markers=True, 
                                color_discrete_sequence=['#FFB74D'], template="plotly_dark")
            fig_month.update_layout(xaxis_title="Bulan", yaxis_title="Jumlah Transaksi")
            st.plotly_chart(fig_month, use_container_width=True)
            
    st.markdown("---")
    st.subheader("Analisis Fraud")
    
    col_fraud1, col_fraud2 = st.columns(2)
    
    with col_fraud1:
        st.markdown("**Tingkat Fraud per Kategori**")
        if not fraud_by_category.empty:
            fraud_cat_sorted = fraud_by_category.sort_values('fraud_rate', ascending=True)
            fig_fcat = px.bar(fraud_cat_sorted, x='fraud_rate', y='category', orientation='h',
                              color='fraud_rate', color_continuous_scale=px.colors.sequential.Reds, template="plotly_dark")
            fig_fcat.update_layout(xaxis_title="Tingkat Fraud", yaxis_title="")
            st.plotly_chart(fig_fcat, use_container_width=True)
            
    with col_fraud2:
        st.markdown("**Distribusi Fraud Berdasarkan Jam**")
        if not fraud_by_hour.empty:
            fig_fhour = px.area(fraud_by_hour, x='hour', y='fraud_count', 
                                color_discrete_sequence=['#FF5252'], template="plotly_dark")
            fig_fhour.update_layout(xaxis_title="Jam", yaxis_title="Jumlah Fraud", xaxis=dict(dtick=1))
            st.plotly_chart(fig_fhour, use_container_width=True)
            
    st.subheader("Top 10 Merchants dengan Kasus Fraud Terbanyak")
    if not top_merchants_fraud.empty:
        st.dataframe(top_merchants_fraud.rename(columns={'merchant': 'Nama Merchant', 'fraud_count': 'Jumlah Kasus Fraud'}), use_container_width=True)

# --- Page 4: Performa Model NLP ---
elif page == "🤖 Performa Model NLP":
    st.title("Performa Model NLP Klasifikasi Kategori")
    st.markdown("Menjawab Pertanyaan III: Akurasi model NLP dalam mengklasifikasikan deskripsi transaksi.")
    
    col_nlp1, col_nlp2 = st.columns(2)
    with col_nlp1:
        st.subheader("Distribusi Kategori Dataset NLP")
        if not nlp_cat_dist.empty:
            fig_nlp_cat = px.bar(nlp_cat_dist, x='category', y='count', color='count',
                                 color_continuous_scale=px.colors.sequential.Purp, template="plotly_dark")
            fig_nlp_cat.update_layout(xaxis_title="Kategori NLP", yaxis_title="Jumlah", xaxis={'categoryorder':'total descending'})
            st.plotly_chart(fig_nlp_cat, use_container_width=True)
            
    with col_nlp2:
        st.subheader("Top Kata dalam Deskripsi Transaksi")
        if not nlp_top_words.empty:
            fig_nlp_words = px.bar(nlp_top_words.sort_values('count', ascending=True), x='count', y='word', orientation='h',
                                   color_discrete_sequence=['#4FC3F7'], template="plotly_dark")
            fig_nlp_words.update_layout(xaxis_title="Frekuensi Kemunculan", yaxis_title="Kata")
            st.plotly_chart(fig_nlp_words, use_container_width=True)
            
    st.markdown("---")
    st.subheader("Evaluasi Model")
    
    if nlp_results:
        acc_lr = nlp_results.get("logistic_regression", {}).get("accuracy", 0) * 100
        acc_nb = nlp_results.get("naive_bayes", {}).get("accuracy", 0) * 100
        
        col_acc1, col_acc2 = st.columns(2)
        col_acc1.markdown(f'<div class="metric-card"><div class="metric-title">Akurasi Logistic Regression</div><div class="metric-value">{acc_lr:.2f}%</div></div>', unsafe_allow_html=True)
        col_acc2.markdown(f'<div class="metric-card"><div class="metric-title">Akurasi Multinomial Naive Bayes</div><div class="metric-value">{acc_nb:.2f}%</div></div>', unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        model_selection = st.radio("Pilih Model untuk melihat Classification Report:", ["Logistic Regression", "Naive Bayes"], horizontal=True)
        
        model_key = "logistic_regression" if model_selection == "Logistic Regression" else "naive_bayes"
        
        report_data = nlp_results.get(model_key, {}).get("classification_report", {})
        
        if report_data:
            # Process report for display
            display_data = []
            for cat, metrics in report_data.items():
                if isinstance(metrics, dict) and cat != "accuracy":
                    display_data.append({
                        "Kategori": cat,
                        "Precision": f"{metrics['precision']:.2f}",
                        "Recall": f"{metrics['recall']:.2f}",
                        "F1-Score": f"{metrics['f1-score']:.2f}",
                        "Support": metrics['support']
                    })
            
            df_report = pd.DataFrame(display_data)
            st.dataframe(df_report, use_container_width=True)
            
            st.info(f"💡 **Insight**: Model **{model_selection}** berhasil mencapai akurasi keseluruhan sebesar **{nlp_results.get(model_key, {}).get('accuracy', 0)*100:.2f}%**. Kategori dengan performa tertinggi umumnya adalah Income dan Food & Dining dikarenakan memiliki jumlah sampel yang representatif dan pola kata yang jelas.")
    else:
        st.warning("Data hasil evaluasi model belum tersedia.")

