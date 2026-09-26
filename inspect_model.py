import joblib
import sys

try:
    pipeline = joblib.load("ML/crowdsense_xgboost_pipeline.pkl")
    print(pipeline)
    print("feature_names_in_:", getattr(pipeline, "feature_names_in_", None))
    print("n_features_in_:", getattr(pipeline, "n_features_in_", None))
    if hasattr(pipeline, "named_steps"):
        for name, step in pipeline.named_steps.items():
            print("\nSTEP:", name)
            print(type(step))
            print("feature_names_in_:", getattr(step, "feature_names_in_", None))
            if hasattr(step, "get_feature_names_out"):
                try:
                    print("feature_names_out:", step.get_feature_names_out())
                except Exception as e:
                    print("Could not get feature_names_out:", e)
except Exception as e:
    print("Error:", e)
    sys.exit(1)
