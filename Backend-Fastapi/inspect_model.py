import joblib

MODEL_PATH = "../ML/crowdsense_xgboost_pipeline.pkl"

pipeline = joblib.load(MODEL_PATH)

print("\n===== PIPELINE =====")
print(pipeline)

print("\n===== PIPELINE TYPE =====")
print(type(pipeline))

print("\n===== FEATURE NAMES IN =====")

if hasattr(pipeline, "feature_names_in_"):
    for i, feature in enumerate(pipeline.feature_names_in_, 1):
        print(f"{i}. {feature}")
else:
    print("feature_names_in_ not available")


print("\n===== NUMBER OF INPUT FEATURES =====")

if hasattr(pipeline, "n_features_in_"):
    print(pipeline.n_features_in_)
else:
    print("n_features_in_ not available")


print("\n===== PIPELINE STEPS =====")

if hasattr(pipeline, "named_steps"):
    for name, step in pipeline.named_steps.items():
        print(f"\n{name}:")
        print(type(step))

        if hasattr(step, "feature_names_in_"):
            print("Input features:")
            print(step.feature_names_in_)

        if hasattr(step, "get_feature_names_out"):
            try:
                print("Output features:")
                print(step.get_feature_names_out())
            except Exception:
                pass